var app = new Vue({
    el: '#app',
    data: {
        username:'',
        password :'',
        usernameError:false,
        passwordError:false,
        usernameErrorMessage:[],
        passwordErrorMessage:[]          
    },
    methods:{
        methods: {
            login: function () {
                this.passwordError=false 
                this.usernameError=false
                this.usernameErrorMessage=[],
                this.passwordErrorMessage=[]
    
                if(this.password.length < 6){
                    this.passwordError=true
                    this.passwordErrorMessage.push({msg:'Password is too short', date:Date.now()})
                }
                
                if(this.username.length < 3){
                    this.usernameError=true
                    this.usernameErrorMessage.push({msg:'Username is too short', date:Date.now()})
                    
                }
                
                if(!(this.username.includes('@'))){
                    this.usernameError=true
                    this.usernameErrorMessage.push({msg:'Username must include @', date:Date.now()})
                    
                }
            },
     mapPage: function(){
        window.location.href='map.html'
        }
    }
}
})
window.addEventListener('load', function() {

    var webAuth = new auth0.WebAuth({
      domain: 'mytransport.auth0.com',
      clientID: 'YcwQ86axCL75rOSGelryPeqcHoS3DW8W',
      responseType: 'token id_token',
      scope: 'openid',
      redirectUri: window.location.href
    });
  
    var loginBtn = document.getElementById('btn-login');
  
    loginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      webAuth.authorize();
    });
  
  });

<<<<<<< HEAD
  

=======
>>>>>>> ab5457133a381f28f4073fd2028453e352e8e9c4

// Register the service worker if available.
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function(reg) {
        console.log('Successfully registered service worker', reg);
    }).catch(function(err) {
        console.warn('Error whilst registering service worker', err);
    });
}

window.addEventListener('online', function(e) {
    // Resync data with server.
    console.log("You are online");
    Page.hideOfflineWarning();
    Arrivals.loadData();
}, false);

window.addEventListener('offline', function(e) {
    // Queue up events for server.
    console.log("You are offline");
    Page.showOfflineWarning();
}, false);

// Check if the user is connected.
if (navigator.onLine) {
    Arrivals.loadData();
} else {
    // Show offline message
    Page.showOfflineWarning();
}

// Set Knockout view model bindings.
ko.applyBindings(Page.vm);

