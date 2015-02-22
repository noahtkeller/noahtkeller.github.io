### Read Me

#### _Tested & Working_

* Chrome, Firefox on Windows 7
* Chrome on Android JellyBean


#### _Known Issues_

* Doesn't function in IE 11 Windows 7
* No hardcoded account
* Pretty Ugly
* Login does not work on Chrome for iPad

#### _Other Thoughts_
  
base Tag in index.html will probably need to be updated  
  
The only way I could conceive to do the hard-coded account was make a Node.js proxy and host it on DigitalOcean.
I could not find way to use a hard-coded refresh token in the purely client-side flow. I figured I could make a quick
node proxy and retrieve the info with the node api client.
  
I thought the "Z" ending in the dateTime string meant relative to the calendar, I was incorrect,
this is where the bug came from of retrieving events from the wrong dates. Now it adds and retrieves
events relative to the Calendar's timezone.

Also, had a bug where it would not update the select date across the controllers, I did not put a $watch
in, which lead to lots of attempted work arounds, where a lot of the mess came from. After looking at it
today I couldn't believe what a mess I made of it before. I think I was stressing about the timeline too much.

#### _Credits_

* Several people Google found