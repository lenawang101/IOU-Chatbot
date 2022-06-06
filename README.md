# IOU-chatbot

A chatbot designed to help groups keep track of finances amongst themselves. Compatible with GroupMe chats.

Written in JavaScript and leverages Google Apps Script API. 

Visit the IOU Chatbot website for more detailed information: https://iouchatbot.wixsite.com/ioubot

# Inspiration
Recently, I went on a day trip to D.C. with a few friends. We did the usual touristy stuff - visit attractions, eat at Chinatown, buy ice cream. At each place, it was usually faster for one person to pay for the group (so as to not hold up the lines) and the rest would later Venmo what they owed.

However, by the end of the day, as we spent our whole metro ride back trying to tally up how much we owed each other, we ran into some blockers. First of all, not everyone ate at every place we visited, so sometimes the bill would only be split between a few people, rather than equally divided amongst the whole group. Since certain places only accepted cash or card, not both, different people paid for different things, and it was hard to keep track of who paid for whom. Sometimes one person paid for others without getting anything themselves, while sometimes the bill included their portion. 

After sitting there with 4 calculators out and a pile of receipts, I thought...there has to be a better way to go about this.

# The Solution
The IOU ChatBot integrates directly with the user's existing group chats to help keep track of these "IOU" transactions between group members. It is currently compatible with GroupMe chats. Its main features include:
- the creation of user profiles
- the ability to log transactions 
- calculations to split bills so users don't need to do the math
- differentiation between payment splitting calculations that are inclusive and exclusive of the person owed 
- the ability to view running tabs
- the ability to clear tabs

# Why I Built This Project This Way
I wanted to keep this project user-oriented. This means at every step, I asked myself: what would make the most sense to a user? 

This is why I chose to create a bot, or extension, that works with popular existing messaging services. This eliminates the need for the user to download and register for a new application, or remember another set of login credentials. After all, it's unlikely that every single group member would want to go through the aforementioned process to keep track of owed payments between each other. This bot allows the group as a whole to perform the set up once, and then everyone can enjoy the benefits. The best part is, not all users need to even have GroupMe - they can simply be added via phone number and still communicate in the chat (and with the bot) through text messages. This makes this chatbot accessible to all.


# Helpful User Commands
When creating the commands, I kept them as simple as possible. My goal was to curate a set of essential features to apply to a widespread range of situations while keeping the syntax short and easy to use.

➣ .new - Create new user profiles (ex: .new ally)

➣ .log - Log transactions between group members (ex: .log 25 eric ana joe in)

➣ .clear - Clear pending debts (ex: .clear owedto laura)

➣ .owedto - View who owes the specified user money (ex: .owedto ed)

➣ .owedby - View who the specify user owes money to (ex: .owedby ed)

➣ .users - View a list of all existing users

# If I Had More Time, I Would...
- Expand this chatbot application to other well-known platforms to reach a larger audience (Discord, WhatsApp, etc.)
- Transfer the data storage to PostgreSQL, rather than using Google Apps Script and its associated products, for more flexibility with data management
- Solicit user feedback on the commands and overall user experience
