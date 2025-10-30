"""Function tool module for wrapping Python functions as executable tools.

This module provides the FunctionTool class, which wraps Python functions to make them
executable within the OxyGent system. It automatically extracts input schemas from
function signatures and handles execution with proper error handling.
"""

import logging
from inspect import Parameter, signature
from typing import Callable, Optional

from pydantic import Field
from pydantic.fields import FieldInfo
from pydantic_core import PydanticUndefined

from ...schemas import OxyRequest, OxyResponse, OxyState
from ..base_tool import BaseTool

logger = logging.getLogger(__name__)


class FunctionTool(BaseTool):
    """Tool that wraps Python functions for execution within the OxyGent system.

    This class provides a bridge between regular Python functions and the
    OxyGent tool system.

    Attributes:
        is_permission_required (bool): Whether permission is required for execution.
            Defaults to True for security.
        func_execute (Optional[Callable]): The Python function to execute.
            Should be an async function or will be wrapped as async.
    """

    is_permission_required: bool = Field(True, description="")
    func_process: Optional[Callable] = Field(None, exclude=True, description="")
    needs_oxy_request: bool = Field(
        False, description="Whether this tool needs oxy_request parameter"
    )

    def __init__(self, **kwargs):
        """Initialize the function tool and extract input schema from function
        signature."""
        super().__init__(**kwargs)
        self.input_schema = self._extract_input_schema(self.func_process)
        self._set_desc_for_llm()

    def _extract_input_schema(self, func):
        """Extract input schema from function signature.

        Args:
            func (Callable): The function to analyze.

        Returns:
            dict: Input schema with 'properties' and 'required' fields describing
                the function's parameters.
        """
        sig = signature(func)
        schema = {"properties": {}, "required": []}

        for name, param in sig.parameters.items():
            param_type = param.annotation
            
            # Get type name, handling empty annotations
            if param_type is Parameter.empty:
                type_name = None
            else:
                type_name = getattr(param_type, "__name__", str(param_type))
                # Skip OxyRequest parameters
                if type_name == "OxyRequest":
                    self.needs_oxy_request = True
                    continue
            
            # Determine parameter properties based on default value
            if isinstance(param.default, FieldInfo):
                # Pydantic Field: extract description and required status from FieldInfo
                description = param.default.description or ""
                is_required = param.default.is_required()
            elif param.default is Parameter.empty:
                # No default value: parameter is required
                description = ""
                is_required = True
            else:
                # Has regular default value: parameter is optional
                description = ""
                is_required = False
            
            # Add parameter to schema
            schema["properties"][name] = {"description": description, "type": type_name}
            if is_required:
                schema["required"].append(name)

        return schema

    async def _execute(self, oxy_request: OxyRequest) -> OxyResponse:
        """Execute the wrapped function with provided arguments."""
        try:
            func_kwargs = {}
            sig = signature(self.func_process)

            for param_name, param in sig.parameters.items():
                param_type = param.annotation
                
                # Get type name, handling empty annotations
                if param_type is Parameter.empty:
                    type_name = None
                else:
                    type_name = getattr(param_type, "__name__", str(param_type))
                    # Handle OxyRequest parameters
                    if type_name == "OxyRequest":
                        func_kwargs[param_name] = oxy_request
                        continue

                # Process parameter value based on availability in arguments
                if param_name in oxy_request.arguments:
                    func_kwargs[param_name] = oxy_request.arguments[param_name]
                else:
                    # Handle missing arguments - use parameter default if available
                    if isinstance(param.default, FieldInfo):
                        func_kwargs[param_name] = (
                            param.default.default if param.default.default is not PydanticUndefined else None
                        )
                    elif param.default is not Parameter.empty:
                        func_kwargs[param_name] = param.default
                    else:
                        # No default value available, pass None
                        func_kwargs[param_name] = None

            result = await self.func_process(**func_kwargs)
            return OxyResponse(state=OxyState.COMPLETED, output=result)
        except Exception as e:
            import traceback
            error_msg = traceback.format_exc()
            logger.error(f"Error in function tool {self.name}: {error_msg}")
            return OxyResponse(state=OxyState.FAILED, output=str(e))
