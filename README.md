# Spacetube Rocketchat

This is a Rocketchat client plugin for Spacetube.

Presumably you're here because you want to build the plugin yourself. That's great, I admire you deeply.

## Building the Plugin

1. Clone this repo
1. `npm install`
1. `npm i -g "@rocket.chat/apps-cli"`
1. Now you have to fix the cli because one of the dependencies is using a node util function that was deprecated in node 16 and presumably you are using a node version higher than 16
1. To find the broken file it might be easier to just do `rc-apps package` and then follow the stack-trace.
1. Find your installed global node_modules then look for `\node_modules\@rocket.chat\apps-cli\node_modules\simple-node-logger\lib\AbstractAppender`
1. AbstractAppender needs to be edited so that lines 65-67 are replaced with 
```
        if (Array.isArray(msg)) {
            const list = msg.map(function (item) {
                if (item instanceof Date) {
```
1. Once that's done, `rc-apps package` should work and you will end up with a zip file in `/dist`. This is your very own self-built plugin, you can now install it in Administration → Marketplace → Private Apps on Rocketchat.


