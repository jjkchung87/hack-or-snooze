"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show favorites when click 'favorites' link */

function navFavorites(evt) {
  console.debug("navFavorites", evt);
  hidePageComponents();
  checkForRememberedUser();
  putFavoritesOnPage();
}

$body.on("click", "#nav-favorites", navFavorites);

/** Show userStories when click 'my stories' link */

function navUserStories(evt) {
  console.debug("navUserStories", evt);
  hidePageComponents();
  checkForRememberedUser();
  putUserStoriesOnPage();
}

$body.on("click", "#nav-my-stories", navUserStories);


// Show User Profile Info when username is clicked

function showUserProfileInfo(evt){
  console.debug("showUserProfileInfo", evt);
  hidePageComponents();
  putUserProfileInfoOnPage();
}

function putUserProfileInfoOnPage(){
  const originalDate = currentUser.createdAt;
  const date = new Date(originalDate);
  const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

  $('#user-name-display').text(`${currentUser.name}`)
  $('#user-username-display').text(`${localStorage.username}`)
  $('#user-account-created-display').text(`${formattedDate}`)
  
  $userProfileInfo.show()

}
$body.on("click",'#nav-user-profile',showUserProfileInfo);


/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// Show story submission page when user clicks 'submit' 

function navSubmit(evt){
  console.debug("navSubmit");
  $storyForm.show();
}

$navSubmit.on("click",navSubmit);