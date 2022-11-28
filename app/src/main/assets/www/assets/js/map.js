var map;
var OSM;
var satellitemap;

//$(function(){
$(document).ready(function () {

  initone();

  var map2, layer2;
  function initone() {

    var vwmslyr = localStorage.getItem('datasetname');
    var vwmsurl = localStorage.getItem('wmsurl');
    var map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      target: 'map2',
      controls: ol.control.defaults({
        attributionOptions: {
          collapsible: false
        }
      })
    }); //end of create map

    var extentval = [190.31136, -18.92447, 189.98589, -19.18862];
    map.getView().setCenter(ol.proj.transform(extentval, 'EPSG:4326', 'EPSG:3857'));
    map.getView().setZoom(7.6);

    var wmsSource = new ol.source.TileWMS({
      url: vwmsurl,
      params: { 'LAYERS': vwmslyr, 'TILED': false },
      serverType: 'geoserver',
      projection: 'EPSG:4326',
      transition: 0
    });

    var wmsLayer = new ol.layer.Tile({
      source: wmsSource
    });

    //map.addLayer(wmsLayer);
    //map.getView().fit(wmsLayer.getExtent(), map.getSize());

    var extentSource = new ol.source.Vector({});
    var vector_layer = new ol.layer.Vector({
      name: 'my_vectorlayer',
      projection: 'EPSG:3857',
      source: extentSource,

      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'rgba(255,0,0,1.0)',
          width: 1
        }),
        fill: new ol.style.Fill({
          //color: 'rgba(172,225,238,1.0)',
          color: 'transparent'
        })
      })

    });

    map.addLayer(vector_layer);

    addLyrExtent();
    function addLyrExtent() {
      var wms = new ol.format.WMSCapabilities();
      //var url = "http://172.16.30.79:8080/geoserver/LandCoverLandUse/wms?service=WMS&version=1.1.0&request=GetCapabilities&"
      var wmsurl_val = vwmsurl + '?';
      var wmscap_val = "service=WMS&version=1.1.0&request=GetCapabilities&"
      var url = wmsurl_val + wmscap_val;
      console.log(url);
      //		var url = "http://172.16.30.79:8080/geoserver/GeographicalNames/wms?service=WMS&version=1.1.0&request=GetCapabilities&"

      /*  if (url) {
 fetch(url)
   .then((response) => response.text())
   .then((html) => {
     document.getElementById('info').innerHTML = html;
   });
} */
      $.get(url, function (data, status) {
        //console.log(data);
        var response = wms.read(data);
        var extentMap = response.Capability.Layer.Layer[3].BoundingBox[0].extent;

        //var extentMap = ol.proj.transform(extentMap_4326, 'EPSG:4326', 'EPSG:3857')
        //var bottomLeft_ = ol.proj.transform(ol.extent.getBottomLeft(extentMap));

        var bottomLeft = ol.extent.getBottomLeft(extentMap);
        var topRight = ol.extent.getTopRight(extentMap);
        var bottomRight = ol.extent.getBottomRight(extentMap);
        var topLeft = ol.extent.getTopLeft(extentMap);
        var ring = [[bottomLeft[0], bottomLeft[1]],
        [topLeft[0], topLeft[1]],
        [topRight[0], topRight[1]],
        [bottomRight[0], bottomRight[1]]];
        // Create a polygon based on the array of coordinates
        var polygongeo = new ol.geom.Polygon([ring]);
        polygongeo.transform('EPSG:4326', 'EPSG:3857');
        var polygongeo_feature = new ol.Feature(polygongeo);
        extentSource.addFeature(polygongeo_feature);


      });
    }//end of addLyrExtent()

    ////////for testing purpose only
  }//end of initone()

});// end of ready function