const appId ='hy3bdijNpRnM18dIqWWy'
const appCode='S9eMeYi7pPXZT45EW0HMBw'

const clientKey ='2872d9f9-60a7-40c3-96ca-f357d4327026'
const clientSecrete ='L5M17FniVQJcvONT8yXqMuTzuQjCveGiDensTvXO+5g='


const geocodeUrl= "https://geocoder.api.here.com/6.2/geocode.json"+
   "?app_id=" + appId +
   "&app_code=" + appCode +
  "&searchtext="

const autocompleteUrl ="http://autocomplete.geocoder.api.here.com/6.2/suggest.json"+
        "?app_id="+ appId +
        "&app_code=" + appCode +
        "&query="


 var map = L.map('map').setView([-33.91, 18.41], 11);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
   
function reqToken(){
    var request = require('request'); 

    var CLIENT_ID = '2872d9f9-60a7-40c3-96ca-f357d4327026';
    var CLIENT_SECRET = 'L5M17FniVQJcvONT8yXqMuTzuQjCveGiDensTvXO+5g=';
    var options = {
      method: 'POST',
      headers: 'ACCEPT: application/json',
      url: 'https://identity.whereismytransport.com/connect/token',
      form: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'client_credentials',
        scope: 'transportapi:all'
      }
    };
    request(options, function (error, response, body) {
        var TOKEN = JSON.parse(body).access_token; // subsequent requests go here, using the TOKEN
      });
}


     var app = new Vue({
        el: '#app',
        data: {           
            startAddress: '',
            destinationAddress: '',
            startLocation: undefined,
            destinationLocation: undefined,
            isStart: true,
            autoCompleteResults: [],
            startPoint: undefined,
            destinationPoint: undefined
        },
        methods: {
            autocomplete: function (isStart) {
                var _this = this
                var text = this.startAddress
    
                if (isStart == false) {
                    text = this.destinationAddress
                }
    
                if(text.length < 5) {
                    return false
                }
    
                fetch(autocompleteUrl + text)
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        _this.autoCompleteResults = response.suggestions
                        _this.isStart = isStart
                    })
            },
            resultSelect: function (result) {
                var _this = this
                fetch(geocodeUrl + result.label)
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        var location = response.Response.View[0].Result[0].Location.DisplayPosition
                        if(_this.isStart == true) {
                            _this.startPoint = L.marker([location.Latitude, location.Longitude])
                            _this.startPoint.addTo(map)
                            _this.startLocation = location
                            _this.autoCompleteResults = []
                        } else {
                            _this.destinationPoint = L.marker([location.Latitude, location.Longitude])
                            _this.destinationPoint.addTo(map)
                            _this.destinationLocation = location
                            _this.autoCompleteResults = []
                        }
                    })
            },                     
            search: function () {
                var _this = this
                fetch("https://platform.whereismytransport.com/api/journeys"+ "'https://identity.whereismytransport.com/connect/token'")
                .then(function(){
                    return response.json()
                })
            }
        
     }
    
})