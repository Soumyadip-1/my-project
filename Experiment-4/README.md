index.html – HTML File Description
Role:
The HTML file defines the structure and content of the web page. It decides what elements are shown and how they are arranged.
Key Points:
Page setup
<!DOCTYPE html> tells the browser it’s HTML5.
<head> contains the page title and style rules (CSS).
Main content inside <body>
<h2> heading: Displays "Live Character Counter" as the title.
<textarea>: A typing area for the user.
id="textInput" so JavaScript can find it.
plceholder="Start typing..." shows a hint until the user starts typing.
<div> with "Characters: 0" shows the live count.
<span id="charCount">0</span> is where the count will update dynamically.
JavaScript linking

<script src="script.js"></script> connects the HTML to the JavaScript file so the page can be interactive.
 script.js – JavaScript File Description
Role:
The JavaScript file handles the functionality and behavior of the page. It listens to what the user types and updates the counter in real time.
Key Points:
Getting elements from HTML
document.getElementById('textInput') gets the textarea element.
document.getElementById('charCount') gets the span for showing the number.
Listening for typing
.addEventListener('input', ...) triggers every time the user types or deletes something in the textarea.
Updating the count
textInput.value.length calculates the total characters in the textarea.
charCount.textContent = ... updates the number displayed on the page instantly.

💡 Summary:

HTML is the skeleton — it sets up the structure.

JavaScript is the brain — it makes the page interactive and responsive
