window.app = {};
window.app.markers = [];
$(document).ready(function() {
  // Sets the map on all markers in the array.
  function setAllMap(map) {
    for (var i = 0; i < window.app.markers.length; i++) {
      window.app.markers[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setAllMap(null);
  }

  // Shows any markers currently in the array.
  function showMarkers() {
    setAllMap(window.app.map);
  }

  function deleteMarkers() {
    clearMarkers();
    window.app.markers = [];
  }

  var mapOptions = {
            center: new google.maps.LatLng(49.249660, -123.119340),
            zoom: 12
          };
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  window.app.map = map;
 
  google.maps.event.addListener(map, 'dragend', function(event) {
      geocode = map.getCenter();
      console.log(geocode);

      $.ajax({
        url: "https://api.500px.com/v1/photos/search?consumer_key=IJ16y7or9lm2mq0kY7Je6C1rbNOxnZuO1zEOfg1Z&image_size[]=20&geo=" + geocode.A + "," + geocode.F + ",10km",
        dataType: 'json',
        success: function(response) {
          deleteMarkers();
          console.log(response);
          response.photos.forEach(function(photo) {
            var contentString = '<h4>' + photo.name + '</h4>' + 
                            "<div><img src='" + photo.image_url + "' /></div>";
            console.log(contentString);
            
            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(photo.latitude, photo.longitude),
              map: map
              
            });

            marker.info = new google.maps.InfoWindow({
              content: contentString
            })
            window.app.markers.push(marker);
            google.maps.event.addListener(marker, 'click', function() {
              marker.info.open(map,marker);
            })

          })

        }

      })
      
    });



});