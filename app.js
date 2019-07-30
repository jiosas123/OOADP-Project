/*
* 'require' is similar to import used in Java and Python. It brings in the libraries required to be used
* in this JS file.
* */
const express = require('express');
const session = require('express-session');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const FlashMessenger = require('flash-messenger');// Library to use MySQL to store session objects
const MySQLStore = require('express-mysql-session');
const db = require('./config/db'); // db.js config file
const passport = require('passport');
var socket = require('socket.io');





/*
* Loads routes file main.js in routes directory. The main.js determines which function
* will be called based on the HTTP request and URL.
*/
const mainRoute = require('./routes/main');
const userRoute = require('./routes/user');
const videoRoute = require('./routes/video');
const itemRoute = require('./routes/item');
const profileRoute = require('./routes/profile');
const chatRoute = require('./routes/chatgroup');

// Bring in Handlebars Helpers here
// Copy and paste this statement only!!
const { formatDate, radioCheck, replaceCommas } = require('./helpers/hbs');

/*
* Creates an Express server - Express is a web application framework for creating web applications
* in Node JS.
*/
const app = express();

// Handlebars Middleware
/*
* 1. Handlebars is a front-end web templating engine that helps to create dynamic web pages using variables
* from Node JS.
*
* 2. Node JS will look at Handlebars files under the views directory
*
* 3. 'defaultLayout' specifies the main.handlebars file under views/layouts as the main template
*
* */
app.engine('handlebars', exphbs({
	helpers: {
		formatDate: formatDate,
		radioCheck: radioCheck,
		replaceCommas: replaceCommas,

		//this is something Ace testing to check for id to compare the id, no worries it wont effect you
		//kong khai you can use this for the mutiple page but it only compares string 
		//run in handlebars #tester blah blah blah 
		tester:function(lvalue, rvalue, options) {

			if (arguments.length < 3)
				throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
		
			var operator = options.hash.operator || "==";
		
			var operators = {
				'==':       function(l,r) { return l == r; },
				'===':      function(l,r) { return l === r; },
				'!=':       function(l,r) { return l != r; },
				'<':        function(l,r) { return l < r; },
				'>':        function(l,r) { return l > r; },
				'<=':       function(l,r) { return l <= r; },
				'>=':       function(l,r) { return l >= r; },
				'typeof':   function(l,r) { return typeof l == r; }
			}
			if (!operators[operator])
				throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
		
			var result = operators[operator](lvalue,rvalue);

			if( result ) {
				return options.fn(this);
				//return true;
			} else {
				return options.inverse(this);
				//return false;
			}
		
		
		}




	},
	defaultLayout: 'main' // Specify default template views/layout/main.handlebar 
}));
app.set('view engine', 'handlebars');

// Body parser middleware to parse HTTP body in order to read HTTP data
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

// Creates static folder for publicly accessible HTML, CSS and Javascript files
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware to use other HTTP methods such as PUT and DELETE
app.use(methodOverride('_method'));

// Enables session to be stored using browser's Cookie ID
app.use(cookieParser());

// To store session information. By default it is stored as a cookie on browser
app.use(session({
	key: 'vidjot_session',
	secret: 'tojiv',
	store: new MySQLStore({
		host: db.host,
		port: 3306,
		user: db.username,
		password: db.password,
		database: db.database,
		clearExpired: true,
		// How frequently expired sessions will be cleared; milliseconds:
		checkExpirationInterval: 900000,
		// The maximum age of a valid session; milliseconds:
		expiration: 900000,
	}),

	resave: false,
	saveUninitialized: false,
}));
// Initilize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public/img'))

app.use(flash());

app.use(FlashMessenger.middleware); // add this statement after flash()
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// Place to define global variables - not used in practical 1
app.use(function (req, res, next) {
	next();
});

// Use Routes
/*
* Defines that any root URL with '/' that Node JS receives request from, for eg. http://localhost:5000/, will be handled by
* mainRoute which was defined earlier to point to routes/main.js
* */
app.use('/', mainRoute); // mainRoute is declared to point to routes/main.js
// This route maps the root URL to any path defined in main.js
app.use('/user', userRoute); // mainRoute is declared to point to routes/main.js
app.use('/item', itemRoute);

app.use('/video', videoRoute);
app.use('/profile', profileRoute);

app.use('/chatgroup',chatRoute);
/*
* Creates a unknown port 5000 for express server since we don't want our app to clash with well known
* ports such as 80 or 8080.
* */
const port = 5000;

// Starts the server and listen to port 5000
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

// Bring in database connection
const BoyDB = require('./config/DBConnection');
// Connects to MySQL database
BoyDB.setUpDB(true); // To set up database with new tables set (true)
// Passport Config
const authenticate = require('./config/passport');
authenticate.localStrategy(passport);

var server = app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

var io = socket(server);

io.on('connection',function(socket){
	console.log('connected with socket',socket.id)


	socket.on('chat',function(data){
		io.sockets.emit('chat',data);
	});

	socket.on('typing',function(data){

		socket.broadcast.emit('typing',data);
	});
});