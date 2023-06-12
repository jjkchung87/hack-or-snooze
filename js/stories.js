"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;


/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  let favoriteIds = currentUser.favorites.map(favoriteStory => favoriteStory.storyId) //seems inefficient to run this here

  if(favoriteIds.includes(story.storyId)){
    return $(`
      <li id="${story.storyId}">
      <i class="fa-solid fa-trash-can fa-xs cursor-pointer"></i>
      <i class="fa-solid fa-star fa-xs favorite-star cursor-pointer"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  } else {
    return $(`
    <li id="${story.storyId}">
    <i class="fa-solid fa-trash-can fa-xs cursor-pointer"></i>
    <i class="fa-regular fa-star fa-xs favorite-star cursor-pointer"></i>
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>
  `);
  }
  

}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();



  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//toggle favorites on and off on stories and make POST request to API

async function toggleStoryFavorite(evt) {
  const storyId =  $(this).parent().attr('id')
  const story = storyList.stories.find(s => s.storyId === storyId)
  
  if ($(this).hasClass('fa-regular')) {
    $(this).removeClass('fa-regular fa-star fa-xs favorite-star').addClass('fa-solid fa-star fa-xs favorite-star');
    const response = await currentUser.addStoryToFavorites(currentUser.username, story ,currentUser.loginToken);
    console.log(response)
  } else if ($(this).hasClass('fa-solid')) {
    $(this).removeClass('fa-solid fa-star fa-xs favorite-star').addClass('fa-regular fa-star fa-xs favorite-star');
    const response = await currentUser.deleteStoryFromFavorites(currentUser.username, story,currentUser.loginToken);
    console.log(response)
  }
}

$body.on("click", '.favorite-star', toggleStoryFavorite);


//delete story and make POST request to API

async function deleteStory(){
  $(this).parent().remove();
  const storyId = $(this).parent().attr('id')
  const response = await storyList.deleteStory(currentUser, storyId )

}

$('body').on('click','.fa-trash-can',deleteStory)



// Adds newly submitted stories on to page

async function addSubmittedStoryOnPage(evt){
    evt.preventDefault();
    const author = $("#story-author").val();
    const title = $("#story-title").val();
    const url = $("#story-url").val(); 
    const token = currentUser.loginToken;

    await storyList.addStory(currentUser,token,{title, author, url});
    $('input').val('');
    hidePageComponents();
    getAndShowStoriesOnStart(); 

    //refresh page automatically
    //up-wipe remove submit form   
        
}

$storyForm.on("submit",addSubmittedStoryOnPage);