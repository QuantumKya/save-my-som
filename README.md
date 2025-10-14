# Save My SoM

SoM is ending? You want to keep all of your projects and their devlogs on hand? Maybe even in an easily presentable format? Well, here's the tool for you!

## Overview

This program has 3 main functions:
- Collecting your project data from SoM,
- building it into HTML for you to use whereever you want,
- and letting you preview the HTML with an Express server.

Local Requirements:
- NodeJS installed

## Providing Cookies

Unfortunately, to collect *your* project data, the program needs to have your SoM browser cookies. But you can prepare them with a few simple steps.
It may teach you a bit about browser cookies!

1. Go to https://summer.hackclub.com/my_projects.
2. Use Inspect tool to open the info panel.
3. Go to the "Storage" tab in the list on top.
4. Expand the "Cookies" dropdown and click on `https://summer.hackclub.com`.
5. You should see a table of three rows.
6. Now, make a new text file on your computer. Name it something like `wowthistutorialislong.txt`.
7. Copy the "Name" and "Value" entries of the first two rows (named `_journey_session` and `ahoy_visitor`) into the text file like this:
```
_journey_session=xxxxx
ahoy_visitor=xxxxx
```
Aaaaand you're done!

## Running the Program

Now that you have your cookies in a file, you can run the program. Oh, yeah, how do you do that?

Clone the Git repository to your computer somewhere and then enter it in cmd.
Run the following command to activate the CLI:
```bash
npm link
```
Then, you can run commands!

There are three commands, whose names are self-explanatory.
Bracketed text indicates a parameter field.
```bash
save-my-som get --cookiefile="<filepath>" # Gathers your project data from SoM. Requires file path to your cookie text file.
```
```bash
save-my-som build # Builds data into folder with HTML and CSS.
```
```bash
save-my-som preview --port=<portnumber> # Opens a local server to preview your HTML folder. Helpful for customization.
```

The order in which they're written here is probably the order in which you'd run them.

Once you've run the commands and have HTML and CSS ready to go... That's it, they're ready to go! Thanks for using my program.


## Customization

I've separated the more complicated and specific code from the customizable, so you can change plenty of things about how the HTML files are built.

In `htmlblocks.mjs`, you can change the HTML snippets that are used for each component; e.g., the layout and CSS classes of elements.

In `build/html/style.css`, you can change... the CSS. Shocker! I've already written some CSS for basic looking-good-ness, but you can change it however you want.

And, of course, you can change anything individual of the HTML once you have it! Happy customizing!

<br>
<br>

© Rohan V-F 2025 (lol I don't know how copyright works)