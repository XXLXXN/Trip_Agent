import React, { useEffect } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
 
const AMapRoute = () => {
    useEffect(() => {
        AMapLoader.load({
            "key": "e1fec889142f5928b4430af9a0b58a3c",   // Web端开发者Key
            "version": "2.0",   // 指定要加载的 JSAPI 的版本
            "plugins": []  //插件列表
        }).then((AMap) => {
            let amap = new AMap.Map('mapContainer', { // mapcontainer为容器的id
                zoom: 15, //初始化地图层级
                center: [112.5266, 27.91507] //初始化地图中心点
            });
            // 标记
            let marker = new AMap.Marker({
                position: [112.5266, 27.91507] // 基点位置
            });
            // 地图添加标记
            amap.add(marker);
        }).catch(e => {
            console.log(e);
        })
 
 
    }, []);
 
    return (
        <div id="mapContainer" style={{ width: '100%', height: '400px' }}></div>
    );
};
 
export default AMapRoute;