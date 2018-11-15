
const appId ='7cfee2FR1NvLiMAP9Nc2'
const appCode='cRCoE04b88xqs1gUPXb2Rw'

const geocodeUrl= "https://geocoder.api.here.com/6.2/geocode.json"+
   "?app_id=" + appId +
   "&app_code=" + appCode +
  "&searchtext="

const routeUrl = "https://route.api.here.com/routing/7.2/calculateroute.json" +
"?app_id=" + appId +
   "&app_code=" + appCode +
"&waypoint0="+ location +
"&waypoint1="+ destination+
"&mode=fastest;car;traffic:disabled"
  
var app = new Vue({
el:"#app",
data:{
    location:'',
    destination:'',
    results:[],
    geoResults:[]
},
methods:{
    route:function(){
        var _this = this
        fetch(routeUrl+this.location,this.destination )
        .then(function(response){
            return response.json()
        })
        .then(function(response){
            console.log('geocode',response)
            _this.geoResults = response.Response.View[0].Result
             
        })
    

    },
    search:function(){
        if(this.location.length > 4 && this.destination !== 0){
            var _this = this
            fetch( )
            .then(function(response){
                return response.json()
            })
          .then(function(response){
          _this.results = response.suggestions
          })          
        }
        else{
            console.log('must use a valid address')
        }
        
    },
    klick:function(result){
        this.location = result.label
    }
}

})
function showMap(map, defaultLayers){
    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);  
    // Set the UI unit system to imperial measurement
    ui.setUnitSystem(H.ui.UnitSystem.IMPERIAL);
  }  
   
  // initialize communication with the platform
  var platform = new H.service.Platform({
    appId,
    appCode,
    useHTTPS: true
  });
  var pixelRatio = window.devicePixelRatio || 1;
  var defaultLayers = platform.createDefaultLayers({
    tileSize: pixelRatio === 1 ? 256 : 512,
    ppi: pixelRatio === 1 ? undefined : 320
  });
  
  // initialize a map - this map is centered over Boston.
  var map = new H.Map(document.getElementById('map'),
    defaultLayers.normal.map,{
    center: {lat:-33.9249 , lng:18.4241},
    zoom: 14,
    pixelRatio: pixelRatio
  });  
  // make the map interactive  
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  
  // Now use the map as required...
  showMap(map, defaultLayers);

  function calculateRouteFromAtoB (platform) {
    var router = platform.getRoutingService(),
      routeRequestParams = {
        mode: 'fastest;publicTransport',
        representation: 'display',
        waypoint0: location, 
        waypoint1: destination,  
        routeattributes: 'waypoints,summary,shape,legs',
        maneuverattributes: 'direction,action'
      };
  
  
    router.calculateRoute(
      routeRequestParams,
      onSuccess,
      onError
    );
  }
  /**
   * This function will be called once the Routing REST API provides a response
   * @param  {Object} result          A JSONP object representing the calculated route
   *
   * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-type-calculate-route.html
   */
  function onSuccess(result) {
    var route = result.response.route[0];
   /*
    * The styling of the route response on the map is entirely under the developer's control.
    * A representitive styling can be found the full JS + HTML code of this example
    * in the functions below:
    */
    addRouteShapeToMap(route);
    addManueversToMap(route);
  
    addWaypointsToPanel(route.waypoint);
    addManueversToPanel(route);
    addSummaryToPanel(route.summary);
    // ... etc.
  }
  
  /**
   * This function will be called if a communication error occurs during the JSON-P request
   * @param  {Object} error  The error message received.
   */
  function onError(error) {
    alert('Ooops!');
  }   
  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);
  
  // Hold a reference to any infobubble opened
  var bubble;
  
  /**
   * Opens/Closes a infobubble
   * @param  {H.geo.Point} position     The location on the map.
   * @param  {String} text              The contents of the infobubble.
   */
  function openBubble(position, text){
   if(!bubble){
      bubble =  new H.ui.InfoBubble(
        position,
        // The FO property holds the province name.
        {content: text});
      ui.addBubble(bubble);
    } else {
      bubble.setPosition(position);
      bubble.setContent(text);
      bubble.open();
    }
  }
  
  
  /**
   * Creates a H.map.Polyline from the shape of the route and adds it to the map.
   * @param {Object} route A route as received from the H.service.RoutingService
   */
  function addRouteShapeToMap(route){
    var lineString = new H.geo.LineString(),
      routeShape = route.shape,
      polyline;
  
    routeShape.forEach(function(point) {
      var parts = point.split(',');
      lineString.pushLatLngAlt(parts[0], parts[1]);
    });
  
    polyline = new H.map.Polyline(lineString, {
      style: {
        lineWidth: 4,
        strokeColor: 'rgba(0, 128, 255, 0.7)'
      }
    });
    // Add the polyline to the map
    map.addObject(polyline);
    // And zoom to its bounding rectangle
    map.setViewBounds(polyline.getBounds(), true);
  }
  
  
  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route  A route as received from the H.service.RoutingService
   */
  function addManueversToMap(route){
    var svgMarkup = '<svg width="18" height="18" ' +
      'xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="8" cy="8" r="8" ' +
        'fill="#1b468d" stroke="white" stroke-width="1"  />' +
      '</svg>',
      dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
      group = new  H.map.Group(),
      i,
      j;
  
    // Add a marker for each maneuver
    for (i = 0;  i < route.leg.length; i += 1) {
      for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
        // Get the next maneuver.
        maneuver = route.leg[i].maneuver[j];
        // Add a marker to the maneuvers group
        var marker =  new H.map.Marker({
          lat: maneuver.position.latitude,
          lng: maneuver.position.longitude} ,
          {icon: dotIcon});
        marker.instruction = maneuver.instruction;
        group.addObject(marker);
      }
    }
  
    group.addEventListener('tap', function (evt) {
      map.setCenter(evt.target.getPosition());
      openBubble(
         evt.target.getPosition(), evt.target.instruction);
    }, false);
  
    // Add the maneuvers group to the map
    map.addObject(group);
  }
  
  
  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route  A route as received from the H.service.RoutingService
   */
  function addWaypointsToPanel(waypoints){
  
  
  
    var nodeH3 = document.createElement('h3'),
      waypointLabels = [],
      i;
  
  
     for (i = 0;  i < waypoints.length; i += 1) {
      waypointLabels.push(waypoints[i].label)
     }
  
     nodeH3.textContent = waypointLabels.join(' - ');
  
    routeInstructionsContainer.innerHTML = '';
    routeInstructionsContainer.appendChild(nodeH3);
  }
  
  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route  A route as received from the H.service.RoutingService
   */
  function addSummaryToPanel(summary){
    var summaryDiv = document.createElement('div'),
     content = '';
     content += '<b>Total distance</b>: ' + summary.distance  + 'm. <br/>';
     content += '<b>Travel Time</b>: ' + summary.travelTime.toMMSS() + ' (in current traffic)';
  
  
    summaryDiv.style.fontSize = 'small';
    summaryDiv.style.marginLeft ='5%';
    summaryDiv.style.marginRight ='5%';
    summaryDiv.innerHTML = content;
    routeInstructionsContainer.appendChild(summaryDiv);
  }
  
  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route  A route as received from the H.service.RoutingService
   */
  function addManueversToPanel(route){
  
  
  
    var nodeOL = document.createElement('ol'),
      i,
      j;
  
    nodeOL.style.fontSize = 'small';
    nodeOL.style.marginLeft ='5%';
    nodeOL.style.marginRight ='5%';
    nodeOL.className = 'directions';
  
       // Add a marker for each maneuver
    for (i = 0;  i < route.leg.length; i += 1) {
      for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
        // Get the next maneuver.
        maneuver = route.leg[i].maneuver[j];
  
        var li = document.createElement('li'),
          spanArrow = document.createElement('span'),
          spanInstruction = document.createElement('span');
  
        spanArrow.className = 'arrow '  + maneuver.action;
        spanInstruction.innerHTML = maneuver.instruction;
        li.appendChild(spanArrow);
        li.appendChild(spanInstruction);
  
        nodeOL.appendChild(li);
      }
    }  
    routeInstructionsContainer.appendChild(nodeOL);
  }
  
  Number.prototype.toMMSS = function () {
    return  Math.floor(this / 60)  +' minutes '+ (this % 60)  + ' seconds.';
  }
  

 
