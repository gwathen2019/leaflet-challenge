//NOTE: use local server (python -m http.server) to run this program. This will resolve issues 
// CORS errors.


// Store our API endpoints inside queryUrl's
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
var queryUrl1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var queryUrl2 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var queryUrl3 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
var TectonicPlatesGeoJSON = "data/PB2002_boundaries.json";

// Perform a GET request to the query URL
// Once we get a response, send the data.features object to the createFeatures function
d3.json(queryUrl1, function(earthquake_data1) {
  d3.json(queryUrl2, function(earthquake_data2) {
    d3.json(queryUrl3, function(earthquake_data3) {
      d3.json(TectonicPlatesGeoJSON,function(tectonicplates_data){
        createFeatures(earthquake_data1.features,earthquake_data2.features,
          earthquake_data3.features, tectonicplates_data.features);
      });
    });
  });
});

function createFeatures(earthquakeData1, earthquakeData2, earthquakeData3, tectonicplatesData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place + "</h3>" +
        "<h3> Magnitude: " + feature.properties.mag + "</h3>" +
        "<hr><p>" + new Date(feature.properties.time) + "</p></hr>" +
        "<hr><p> Url: " + feature.properties.url + "</p></hr>");
    }
    //create a color function for the geojsonMarkers
    function getColor(m) {
        return m > 7 ? '#8B0000' ://dark red
               m > 6 ? '#B22222' ://firebrick
               m > 5 ? '#FF4500' ://orangered
               m > 4 ? '#FF8C00' ://darkorange
               m > 3 ? '#F0E68C' ://khaki
               m > 2 ? '#FFFF00' ://yellow
               m > 1 ? '#7CFC00' ://lawngreen
                       '#00FFFF';//aqua
    }
    //create a radius function for the geojsonMarkers
    function getRadius(r) {
        return r > 7 ? '20' :
               r > 6 ? '18' :
               r > 5 ? '15' :
               r > 4 ? '12' :
               r > 3 ? '9' :
               r > 2 ? '7' :
               r > 1 ? '5' :
                       '4';
    }

    //create a Style function to apply to the geojsonMarkers
    function style(feature) {
        return {
            radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5
        };
    }
    
    var geojsonMarkerOptions = {
    };

// Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array
    
    var earthquakes1 = L.geoJSON(earthquakeData1, {
      onEachFeature: onEachFeature,
      style: style,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
      },
    });

    var earthquakes2 = L.geoJSON(earthquakeData2, {
      onEachFeature: onEachFeature,
      style: style,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
      },
    });

    var earthquakes3 = L.geoJSON(earthquakeData3, {
      onEachFeature: onEachFeature,
      style: style,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
      },
    });

// Create a GeoJSON layer containing a pointToLayer function on the tectonic plates data object

    var tectonicplates = L.geoJSON(tectonicplatesData, {
      pointToLayer: function (feature, latlng) {
			return L.marker(latlng);
    }
    });

  // Sending our earthquakes and tectonic plates layers to the createMap function
  createMap(earthquakes1, earthquakes2, earthquakes3, tectonicplates);
}

function createMap(earthquakes1, earthquakes2, earthquakes3, tectonicplates) {

        // Define basemap layers (Street, Darkmap, Outdoors, Satellite)
        var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: API_KEY
        });
      
        var darkmap = L.tileLayer("https://api.tiles.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 18,
          id: "dark-v10",
          tileSize: 512,
          zoomOffset: -1,
          accessToken: API_KEY
        });

        var outdoors = L.tileLayer("https://api.tiles.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 18,
          id: "outdoors-v11",
          tileSize: 512,
          zoomOffset: -1,
          accessToken: API_KEY
        });

        var satellite = L.tileLayer("https://api.tiles.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 18,
          id: "satellite-streets-v11",
          tileSize: 512,
          zoomOffset: -1,
          accessToken: API_KEY
        });
      
        // Define a baseMaps object to hold our base layers
        var baseMaps = {
          "Street Map": streetmap,
          "Dark Map": darkmap,
          "Outdoors": outdoors,
          "Satellite": satellite
        };

  // Create overlay object to hold our overlay layers
  var overlayMaps = {
    "Earthquakes last 24 hours": earthquakes1,
    "Earthquakes last 7 days": earthquakes2,
    "Significant Earthquakes last 30 days": earthquakes3,
    "TectonicPlates": tectonicplates
  };

  // Create our map, giving it the streetmap, 24-hr earthquakes, and tectonic plate layers to display on load
  var myMap = L.map("map", {
    center: [
      35, -70
    ],
    zoom: 3,
    layers: [streetmap, earthquakes1, tectonicplates]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  //Create a legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {
  
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5, 6, 7],
        labels = [];

    function getColor(m) {
    return m > 7 ? '#8B0000' ://dark red
            m > 6 ? '#B22222' ://firebrick
            m > 5 ? '#FF4500' ://orangered
            m > 4 ? '#FF8C00' ://darkorange
            m > 3 ? '#F0E68C' ://khaki
            m > 2 ? '#FFFF00' ://yellow
            m > 1 ? '#7CFC00' ://lawngreen
                    '#00FFFF';//aqua
}    

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };
  
  legend.addTo(myMap);

}
