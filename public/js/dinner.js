// import { link } from "fs";

// Display restaurant Info
// function displayRestaurantInfo() {
// ***************************

console.log("****** DINNER Button Clicked ******");

var zipCode = localStorage.getItem("zipcode");
console.log("*** Zip Code for Restaurant Search: " + zipCode);

// var newUser = {
//    moviedinner_date: localStorage.getItem(userDate),
//    zipcode: userZipCode,
//    movieTitle: movieTitle,
//    theater: theaterName,
//    // theatre: “AMC whatever”,
//    restaurantname: restname,
//    // restaurantname: “YUMY YUMY”,
//    restaurantcategory: category
//    // restaurantcategory: “confort drunken food”
// };

// newUser.moviedinner_date = localStorage.getItem("date");
// newUser.zipcode = localStorage.getItem("zipcode");
// newUser.movieTitle = localStorage.getItem("movieTitle");
// newUser.theater = localStorage.getItem("theaterName");

function yelpCall() {
    var restSearch = {
        zipcode: zipCode
    };
    // console.log("here's the zip code from local storage stored in an object: ", restSearch)

    //Route to call the Yelp API to retrieve dinner information

    $.ajax("/api/dinner", {
        type: "GET",
        data: restSearch
    }).then(function (response) {
        console.log("YELP Returned Restaurant Data.");
        console.log(response);
        var results = response;
        // console.log("Array Length: " + results.length);

        // $("#movie-view").html(JSON.stringify(response,"",4));
        $("#restaurant-appear-here").html(JSON.stringify(response, "", 4));

        for (var i = 0; i < results.length; i++) {
            // console.log("GOING FOR IT");
            // Create a DIV to hold each of our restaurants and its description
            var restDisplayDiv = $("<div>").addClass("restDIV card horizontal blue-grey darken-1");
            // .attr("style", "width: 50%");

            // Create a variable to hold each restaurant name 
            var restName = results[i].name;
            // console.log("Restaurant Name: " + restName);

            var imageUrl = results[i].image_url;
            // console.log("Image URL: " + imageUrl);
            var cardHeader = $("<div>").addClass("card-image");
            
            var cardIMG = $("<img>").attr("src", imageUrl);
            // .attr("style", "width:200px;height:180px;");

            cardHeader.append(cardIMG);

            // Display the restaurant name in each individual DIV
            var nameDisplay = $("<span>").text(restName).addClass("restName card-title");

            // Create an inner DIV for each Restaurant title and description
            // var innerRestDiv = $("<div>").addClass("card-content").attr("id", restName);

            // Create a variable to hold each Restaurant description

            var isClosed = results[i].is_closed;
            // console.log("Open: " + isClosed);
            var priceLevel = results[i].price;
            // console.log("Price Level: " + priceLevel);
            var rating = results[i].rating;
            // console.log("Rating: " + rating);
            var category = results[i].categories[0].alias;
            console.log("Category: ", category);

            var cardContent = $("<div>").addClass("card-stacked");

            var openDisplay = $("<p>").addClass("openDisplay card-content");

            // Display the Restaurant description in each individual DIV
            if (!isClosed) {
                openDisplay.text("Open");
            }
            else {
                openDisplay.text("Closed"); 
            }

            openDisplay.append("<br>Price: " + priceLevel + "<br>Rating: " + rating+ "<br>" + category);
            // var priceDisplay = $("<p>").text("Price: " + priceLevel).addClass("priceDisplay").addClass("card-content");
            // var ratingDisplay = $("<p>").text("Rating: " + rating).addClass("ratingDisplay").addClass("card-content");

            // Add the restaurant name and other info to the individual DIV
            // innerRestDiv.append(nameDisplay, openDisplay, priceDisplay, ratingDisplay);

            // grab restaurant name for id

            var linkToNext = $("<a>").text("Eat here");
            // .attr("src", "#"); // will link to final page and store restaurant to database
            var pickMe = $("<div>").addClass("card-action").append(linkToNext).attr("name", results[i].name).attr("address", results[i].location.address1).attr("category",category);

            // restDisplayDiv.append(innerRestDiv);
            cardContent.append(nameDisplay, openDisplay, pickMe);

            restDisplayDiv.append(cardHeader, cardContent);

            // Add all the restaurants to an existing DIV on the page called nearbyRestaurants
            // $("#restaurant-appear-here").prepend(restDisplayDiv);
            $("#nearbyRestaurants").prepend(restDisplayDiv);
        }
    });
};

var newUser = {
    moviedinner_date: localStorage.getItem("date"),
    zipcode: localStorage.getItem("zipcode"),
    movieTitle: localStorage.getItem("title"),
    theater: localStorage.getItem("theater"),
    restaurantname: "",
    restaurantcategory: ""
 };

function submitUserInfo() {
    $(document).on("click", ".card-action", function() {
        // event.preventDefault();
        console.log(this);
        var restName = $(this).attr("name");
        var restAddress = $(this).attr("address");
        var category = $(this).attr("category");
        console.log("Restaurant Selected: " + restName + restAddress);
        console.log("Category: ", category);

        // populate user
        newUser.restaurantname = restName;
        // newUser.restaurantcategory= restAddress;
        newUser.restaurantcategory = category;
        

        console.log("Here is the new user data: " + JSON.stringify(newUser));

        // Make an AJAX call to our users database to post the movieDate and zipCode
        $.ajax("/api/users", {
            type: "POST",
            data: newUser
        }).then(function (){
            console.log("***** New user information added to the SQL database ******");
        });
    });
 };
 
submitUserInfo();

// console.log(JSON.stringify(newUser));

yelpCall();