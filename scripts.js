
// CONFIGS
var maxWeight = 1;
var minWeight = 0;
var showMarkers = true;
var markerRadius = 25000;
var showHeatmap = false;
var heatmapRadius = 36;
var showHelpers = true;

var styles = [{
  "featureType": "road",
  "elementType": "geometry",
  "stylers": [{ "lightness": 100 }, { "visibility": "on" }]
}, {
  "featureType": "road",
  "elementType": "labels",
  "stylers": [{ "visibility": "off" }]
}, {
  "featureType": "poi",
  "elementType": "labels",
  "stylers": [{ "visibility": "off" }]
}];

window.chosenIndex = 0;
window.intervali = -1;
$(document).ready(function () {
  //var dt = [dataGroup[0], dataGroup[1]];
  //dataGroup = dt;
  window.setNextGroup = function(){
    window.chosenIndex++;
    if(window.chosenIndex > dataGroup.length){
      window;chosenIndex=0;
    }
    $('#myselect').val(window.chosenIndex).trigger('change');
  }
  $('#btn').click(function(){
    if(window.intervali > 0) {
      clearInterval(window.intervali);
      window.intervali = 0;
      $('#btn').html('PLAY')
    } else {
      var i = $('#timeout').val();
      if(isNaN(i)) i = 1000;
      window.intervali = setInterval(window.setNextGroup,i);
      $('#btn').html('STOP')
    }
  });

  $.each(dataGroup, function (i, d) {
    console.log('<option value="' + i + '">' + d.name + '</option>');
    $('#myselect').html($('#myselect').html() + '<option value=' + i + '>' + d.name + '</option>');
  });

  $('#myselect').change(function () {
    var val = $(this).val();
    window.chosenIndex=val;
    //var dadosDaVez = dataGroup.filter(function(a){
    //    return a.name == val 
    //})[0];
    var dadosDaVez = dataGroup[val];
    //console.log('dados da vez', dadosDaVez);
    window.mapReady(dadosDaVez.data);
    //window.setGroupVisible(dadosDaVez.name);
  });

  window.setGroupVisible = function (name) {
    $.each(window.allMarkers, function (i, m) {
      //m.setMap(null);
      m.setVisible(false);
    });
    var group = window.groupedMarkers[name];
    $.each(group, function (i, m) {
      m.setVisible(true);
    });
  }

  window.mapReady = function (dadosDaVez) {
    var myLatlng = new google.maps.LatLng(-7.31, -39.30);
    window.map = window.map || new google.maps.Map(document.getElementById("map-canvas"), {
      zoom: 5,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: styles,
      disableDefaultUI: true
    });
    if (window.markers) {
      $.each(window.markers, function (i, m) {
        m.setMap(null);
      });
    }
    window.markers = [];
    $.each(dadosDaVez, function (i, e) {
      e.location = new google.maps.LatLng(e.latitude, e.longitude);

      //fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + e.latitude + ',' + e.longitude + '&key=AIzaSyBvSR-z-DPXEfccE9bwj-FdH1fbsQl60Qg')
      //  .then((response) => response.json())
      //  .then((responseJson) => {
          //console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
      //    var stateName = responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'administrative_area_level_1').length > 0)[0].short_name;
      //    var cityName = responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'administrative_area_level_2').length > 0)[0].short_name;
          //document.getElementById('a').innerHTML = document.getElementById('a').innerHTML +'<br/>' + stateName + ', ' + cityName;
          var infowindow = new google.maps.InfoWindow({
            content: '<div style="color:black"><b>'// + stateName + ', ' + cityName + '</b>'
              + '<br/>Peso:' + e.weight
              + '<br/>Freq:' + e.freq
              + '<br/>Evapotranspiração:' + e.ET
              + '<br/>Insolação Total:' + e.IT
              + '<br/>Precipitação:' + e.P
              + '<br/>Temp. Comp. Média:' + e.TCM
              + '<br/>Temp. Máx. Média:' + e.TMaxM
              + '<br/>Temp. Mín Média:' + e.TMinM
              + '<br/>Umidade Rel. Média:' + e.URM
              + '<br/>Vel. Média Vento:' + e.VMV
              + '</div>'
          });
          // var marker = new google.maps.Marker({
          //     position: e.location,
          //     map: map,
          //     title: 'Uluru (Ayers Rock)'
          // });
          // marker.addListener('click', function () {
          //     infowindow.open(map, marker);
          // });
          var color = perc2color(e.weight, minWeight, maxWeight);
          if (showMarkers) {
            var cityCircle = new google.maps.Circle({
              strokeColor: color,
              strokeOpacity: 1,
              strokeWeight: 3,
              fillColor: color,
              fillOpacity: 0.75,
              map: map,
              center: e.location,
              radius: markerRadius * (0.5 + (e.freq * 1.5)),
              clickable: true
            });
            window.markers.push(cityCircle);
            google.maps.event.addListener(cityCircle, 'click', function (ev) {
              infowindow.setPosition(ev.latLng)
              infowindow.open(map, cityCircle);
            });
          }
        })

    //});

    if (showHelpers) {
      var cityCircle1 = new google.maps.Circle({
        strokeColor: '#000',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#000',
        fillOpacity: 0,
        map: map,
        center: new google.maps.LatLng(-10.479810, -27.672232),
        radius: markerRadius * (0.5 + (0 * 1.5)),
        clickable: true
      });
      window.markers.push(cityCircle1);
      var cityCircle2 = new google.maps.Circle({
        strokeColor: '#000',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#000',
        fillOpacity: 0,
        map: map,
        center: new google.maps.LatLng(-11.863324, -27.603340),
        radius: markerRadius * (0.5 + (1 * 1.5)),
        clickable: true
      });
      window.markers.push(cityCircle2);
    }

    if (showHeatmap) {
      var heatmap = new google.maps.visualization.HeatmapLayer({
        data: dadosDaVez,
        radius: heatmapRadius,
        opacity: 0.8
      });
      heatmap.setMap(map);
      window.markers.push(heatmap);
      console.log(dadosDaVez);
    }
  }

  window.createAllMarkers = function () {
    window.allMarkers = [];
    window.groupedMarkers = {};
    window.cachedGPS = {};
    window.mapReady([]);
    $.each(dataGroup, function (i, d) {
      window.groupedMarkers[d.name] = [];
      $.each(dataGroup[i].data, function (i, e) {
        e.location = new google.maps.LatLng(e.latitude, e.longitude);
        if (cachedGPS[e.latitude + '_' + e.longitude]) {
          createMarkerWithGPS(e, cachedGPS[e.latitude + '_' + e.longitude], d)
        } else {
          window.tryGeocodeAndAddMarker(e, d);
        }
      });
    });
  }

  window.tryGeocodeAndAddMarker = function (e, group) {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + e.latitude + ',' + e.longitude + '&key=AIzaSyBvSR-z-DPXEfccE9bwj-FdH1fbsQl60Qg')
      .then((response) => response.json())
      .then((responseJson) => {
        var criou = createMarkerWithGPS(e, responseJson, group);
        if (criou) {
          cachedGPS[e.latitude + '_' + e.longitude] = responseJson;
        } else { // tenta de novo 
          setTimeout(function () {
            window.tryGeocodeAndAddMarker(e, group);
          }, 1000);
        }
      });
  }

  window.createMarkerWithGPS = function (e, responseJson, group) {
    if (!responseJson || !responseJson.results || !(responseJson.results.length > 1)) {
      console.log('ERRO:', e, responseJson, group.name)
      return false;
    }
    var stateName = responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'administrative_area_level_1').length > 0)[0].short_name;
    var cityName = responseJson.results[0].address_components.filter(x => x.types.filter(t => t == 'administrative_area_level_2').length > 0)[0].short_name;
    var infowindow = new google.maps.InfoWindow({
      content: '<div style="color:black"><b>' + stateName + ', ' + cityName + '</b>'
        + '<br/>Peso:' + e.weight
        + '<br/>Freq:' + e.freq
        + '<br/>Evapotranspiração:' + e.ET
        + '<br/>Insolação Total:' + e.IT
        + '<br/>Precipitação:' + e.P
        + '<br/>Temp. Comp. Média:' + e.TCM
        + '<br/>Temp. Máx. Média:' + e.TMaxM
        + '<br/>Temp. Mín Média:' + e.TMinM
        + '<br/>Umidade Rel. Média:' + e.URM
        + '<br/>Vel. Média Vento:' + e.VMV
        + '</div>'
    });
    var color = perc2color(e.weight, minWeight, maxWeight);
    if (showMarkers) {
      var cityCircle = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: color,
        fillOpacity: 0.75,
        map: map,
        center: e.location,
        radius: markerRadius * (0.5 + (e.freq * 1.5)),
        clickable: true
      });
      window.allMarkers.push(cityCircle);
      window.groupedMarkers[group.name].push(cityCircle);
      google.maps.event.addListener(cityCircle, 'click', function (ev) {
        infowindow.setPosition(ev.latLng)
        infowindow.open(map, cityCircle);
      });
    }
    return true;
  }

  $.getScript("https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=visualization,geocode,geometry&key=AIzaSyCYhI5DKGX1t8Oref8HdsUXWsA9a25NXCg")
    .done(function (script, textStatus) {
      window.mapReady(dataGroup[0].data);
      //window.createAllMarkers();
    });
})

function perc2color(perc, min, max) {
  var base = (max - min);

  if (base == 0) { perc = 100; }
  else {
    perc = (perc - min) / base * 100;
    perc = 100 - perc
  }
  var r, g, b = 0;
  if (perc < 50) {
    r = 255;
    g = Math.round(5.1 * perc);
  }
  else {
    g = 255;
    r = Math.round(510 - 5.10 * perc);
  }
  //r=255;b=0;g=(perc*.01)*255;
  var h = r * 0x10000 + ((g.toString().split('.')[0]) * 0x100) + b * 0x1;
  var hex = '#' + ('000000' + h.toString(16)).slice(-6);
  hex = '#' + r.toString(16).split('.')[0] + g.toString(16).split('.')[0] + '00'
  console.log(r.toString(16), g, g.toString(16), b.toString(16), perc, h, hex);
  return hex;
}