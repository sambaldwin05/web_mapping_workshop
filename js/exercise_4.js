// Here is the javascript setup for a basic map:

// Enter your mapbox map id here to reference it for the base layer,
// this one references the ugly green map that I made.
var mapId = 'sambaldwin05.019h34oc';

// And this is my access token, use yours.
var accessToken = 'pk.eyJ1Ijoic2FtYmFsZHdpbjA1IiwiYSI6ImNpbnE0dDJqZzEwNDJ0cWtqdWM5MXpsb3oifQ.V9cC7ebF_7CRrd5tkmIoBA';

// Create the map object with your mapId and token,
// referencing the DOM element where you want the map to go.
L.mapbox.accessToken = accessToken;
var map = L.mapbox.map('map', mapId);

// Set the initial view of the map to the whole US
map.setView([39, -96], 4);

// Great, now we have a basic web map!
var dataFileToAdd = 'data/restaurants.geojson';

// Buildinate our feature.
var featureLayer = L.mapbox.featureLayer();
    featureLayer.loadURL(dataFileToAdd);
    featureLayer.addTo(map);

featureLayer.on('ready', function(){
    this.eachLayer(function(layer){
        layer.setIcon(L.mapbox.marker.icon({
            "marker-color": "#8834bb",
            "marker-size": "large",
            "marker-symbol": "restaurant"
        }))
    });
    map.fitBounds(featureLayer.getBounds());
});

//featureLayer.on('ready', function(){
//  this.eachLayer(function(layer){
//      layer.bindPopup('Welcome to ' + layer.feature.properties.name);
//    });
//});

var clickHandler = function(e){
  // Init our state.
  $('#info').empty();
  var feature = e.target.feature;
  
  $('#sidebar').fadeIn(400, function(){
    var info = '';
    info += '<div>';
    info += '<h2>' + feature.properties.name + '</h2>';
    // Display some properties if we have them.
    if(feature.properties.cuisine) info += '<p>' + feature.properties.cuisine + '</p>';
    if(feature.properties.phone) info += '<p>' + feature.properties.phone + '</p>';
    var website = feature.properties.website;
    if(website) info += '<p><a href="' + website + '">' + website + '</a></p>';
    
    info += '</div>';
    $('#info').append(info);
  })
};

featureLayer.on('ready', function(){
    this.eachLayer(function(layer){
        layer.on('click', clickHandler);
    })
})
map.on('click', function(){
    $('#sidebar').fadeOut(200);
})

// Do location things.
var myLocation = L.mapbox.featureLayer().addTo(map);

map.on('locationfound', function(e){
    myLocation.setGeoJSON({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [ e.latlng.lng, e.latlng.lat ]
        },
        properties: {
            "title": "Here I am!",
            "marker-color": "#ff8888",
            "marker-symbol": "star"
        }
    })
})

map.locate({setView: true});

