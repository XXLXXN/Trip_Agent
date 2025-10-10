from pydantic import Field, fields

from oxygent.oxy import FunctionHub

time_tools = FunctionHub(name="time_tools")


@time_tools.tool(description="Get current time in a specific timezones")
def get_current_time(
    timezone: str = Field(
        description="IANA timezone name (e.g., 'America/New_York', 'Europe/London'). Use 'Asia/Shanghai' as local timezone if no timezone provided by the user. "
    ),
) -> str:
    from datetime import datetime

    from pytz import timezone as pytimezone

    # 系统级修复后，这里的检查可以简化
    if timezone is None:
        timezone = "Asia/Shanghai"

    tz = pytimezone(timezone)
    now = datetime.now(tz)
    return str(now.strftime("%Y-%m-%d %H:%M:%S %Z%z"))


@time_tools.tool(description="Convert time between timezones")
def convert_time(
    source_timezone: str = Field(
        description="Source IANA timezone name (e.g., 'America/New_York', 'Europe/London'). Use 'Asia/Shanghai' as local timezone if no source timezone provided by the user."
    ),
    time: str = Field(description="Time to convert in 24-hour format (HH:MM)"),
    target_timezone: str = Field(
        description="Target IANA timezone name (e.g., 'Asia/Tokyo', 'America/San_Francisco'). Use 'Asia/Shanghai' as local timezone if no target timezone provided by the user."
    ),
) -> str:
    from datetime import datetime

    import pytz

    # 系统级修复后，处理可能的 None 值
    if source_timezone is None:
        source_timezone = "Asia/Shanghai"
    if time is None:
        time = "00:00"
    if target_timezone is None:
        target_timezone = "Asia/Shanghai"

    dt = datetime.strptime(time, "%H:%M")
    # Create timezone objects for the source and target timezones
    src_tz = pytz.timezone(source_timezone)
    dst_tz = pytz.timezone(target_timezone)
    # Localize the datetime object to the source timezone
    src_dt = src_tz.localize(dt)
    # Convert the datetime object to the target timezone
    dst_dt = src_dt.astimezone(dst_tz)
    # Format the converted datetime object as a string
    converted_time = dst_dt.strftime("%H:%M")
    return str(converted_time)
