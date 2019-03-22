// BOTBOYCARL
// THE BEST BBC YOU'LL EVER SEE
// Created by Sang Nguyen

// Creating the client
const Discord = require('discord.js');
const client = new Discord.Client();
const gif = require('./gifURLs.json')

// To notify when online and idle
client.on('ready', () => {
    console.log("Loading botboycarl v2.0.2");
    console.log("Connected as " + client.user.tag);
    console.log("Servers:"); // Lists servers (guilds) that the bot is connected to
    client.guilds.forEach((guild) => {
        console.log(" ~ " + guild.name);
    });

    client.user.setPresence({
        game: {
            name: "You Sleep ;)",
            type: 'WATCHING'
        },
        status: 'idle'
    });
});

// Testing guild
client.on('guildCreate', guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`)
})

// Logging in with the token
client.login("NTE4NTI0Njc2NjI1MDA2NjAy.DuSCeg.zFMYY4iIKG9824EC2PdRbJniQgU");

// GLOBAL FLAGS
var blackjackOn = false;
var rpsOn = false;
var highLowOn = false;

// GLOBAL VARIABLES (Different Variables so you can play them all at once *PEOPLE ACTUALLY DO*)
var userScore = 0, dealScore = 0, uHand = [], dHand = [], userStay = false; // Blackjack
var RPS_uScore = 0, RPS_cScore = 0; // Rock Paper Scissors

// To receive and process commands
client.on('message', (gotMsg) => {
    if(gotMsg.author.bot) { // Bot won't respond to Bot messages
        return;
    }

    // Must use '~!' prefix!
    if(gotMsg.content.startsWith('~!')) {
        command(gotMsg);
    }

    else if(!gotMsg.content.startsWith('~!') && (blackjackOn || rpsOn)) {
        talk2Bot(gotMsg);
    }
});

// Processes input that start with ~!
function command(message) {
    let msgID = message.id;
    let noPrefix = message.content.substr(2);
    let noPrefixArray = noPrefix.split(' ');
    let cmd = noPrefixArray[0];
    let parameters = noPrefixArray.slice(1);
    
    console.log("Command Received: " + cmd);
    console.log("Parameters: " + parameters);

    switch(cmd) {
        // Basic command to test if bot is on and working
        case 'ping':
            message.channel.send("pong!");
        break;
        
        // testing commands
        case 'test':
            testHand = ["A:spades:", "K:clubs:", "Q:hearts:", "J:diamonds:", "10:spades:", "5:clubs:", "8:hearts:", "2:diamonds:"]
            for(var n = 0; n < testHand.length; n++) {
                message.channel.send(testHand[n]);
                cardNum = /[1][0]|[2-9]|[AJKQ]/.exec(testHand[n]).toString();
                message.channel.send(cardNum);
            }
            /*message.author.edit({embed: {
                color: '#FF9BE2',
                description: "edited bitch"
            }}); */
        break;

        // Blackjack
        case 'blackjack':
        case 'bj':
            // Initilizing Blackjack
            blackjackOn = true; // Bot is in Blackjack Mode
            userScore = 0, dealScore = 0; // Clear scores
            uHand = [], dHand = []; // Clear hands
            userStay = false; // Clear flag

            // Draw for each person
            while(dHand.length < 2) {
                bjDraw(dHand);
            }
            message.channel.send(`Dealer draws: ${dHand[0]} ?:wink:`);

            while(uHand.length < 2) {
                bjDraw(uHand);
            }
            message.channel.send(`You draw: ${uHand[0]} ${uHand[1]}`);

            userScore = bjScoreSum(uHand);

            // To check if user has Blackjack
            if((uHand[0] == 'A' && (uHand[1] == 'J' || uHand[1] == 'Q' || uHand[1] == 'K')) || (uHand[1] == 'A' && (uHand[0] == 'J' || uHand[0] == 'Q' || uHand[0] == 'K'))) {
                message.channel.send("You got Blackjack! You win!");
                blackjackOn = false;
            }

            // To check if user busted
            else if(checkWin(userScore, dealScore) !== null) {
                message.channel.send(checkWin(userScore, dealScore));
                blackjackOn = false;
            }
        break;
        
        // To stop any game at the moment *Remember make difference instances of games for each user*
        case 'cancel':
        case 'exit':
        case 'quit':
        case 'stop':
            blackjackOn = false;
            rps = false;
        break;
        
        // Displays a list of commands
        case 'commands':
        case 'help':
        case 'hep':
        case 'h':
            embedMsg = new Discord.RichEmbed()
                .setColor("#2F83CE")
                .setAuthor("List of Commands for BotBoyCarl")
                .setThumbnail(client.user.avatarURL)
                .setTitle("*Each command is prefixed with '~!'*")
                .addField("'blackjack' / 'bj'", "Starts the Blackjack game! After the cards are drawn, use 'hit' or 'stay' or 'stand' to proceed.")
                .addField("'highlow' / 'hj'", "Starts Higher or Lower game.")
                .addField("'lick' '@targetUser'", "Licks a user (You have to mention them)")
                .addField("'ping'", "pong!")
                .addField("'roll' '?d?'","Rolls any number of dice (MAX: 25) with any number of sides (MAX: 1000000)")
                .addField("'rps'", "Starts Rock, Paper, Scissor!")
                .addField("'slap' @targetUser", "Slaps a user (You have to mention them)")
                .addField("'transport' / 'tp' '(CHANNELNAME)'", "Moves all users in the current channel to another channel");
            if(message.author.id == '159818886827474946') {
                embedMsg.addField("For you: 'secretlick'", "Allows you to anonymously lick another user");
            }
            message.channel.send(embedMsg);
        break;

        // High Low Game
        case 'highlow':
        case 'hl':
            highLowOn = true;
            message.channel.send(new Discord.RichEmbed()
                .setColor('#00BFFF')
                .setDescription("What mode would you like to play?")
                .setField("Simple", "Range is [1-10]")
                .setField("Cards", "Play with a deck!")
                .setField("Excessive", "Range is [1-10000]")
            )
            .then(message.channel.awaitMessaages(response => message.content,{
                max: 1,
                time: 6000,
                errors: ['time']
            }))
            .then((collected) => {

            })
        break;

        // To lick a user
        case 'lick':
            if(parameters[0] == message.author.tag) { // To check if the user is indeed licking themselves
                message.channel.send(new Discord.RichEmbed()
                    .setColor('#FF9BE2')
                    .setDescription("lickself.gif")
                );
            }
            if(!getID(parameters[0])) { // To check if user misses their lick
                randNum = Math.floor(Math.random() * 4) // Choose a random gif                
                message.channel.send(new Discord.RichEmbed()
                    .setColor('#FF9BE2')
                    .setDescription(client.users.get(message.author.id).username + " violently slurps the air.")                    
                );
                break;
            }
            if(getID(parameters[0]) == client.user.id) { // The bot reacts to a lick directed at them
                message.channel.send(new Discord.RichEmbed()
                    .setColor('#FF9BE2')
                    .setDescription(client.users.get(message.author.id).username + " licks " + client.user.username + ".")
                )
                .then(message.channel.send('Ew! I don\'t know where your mouth has been!'));
                break;
            }            
            message.channel.send(new Discord.RichEmbed() // Successful lick
                .setColor('#FF9BE2')
                .setDescription(client.users.get(message.author.id).username + " licks " + message.guild.members.get(getID(parameters[0])).displayName + ".")
            );
        break;
        
        // To roll any number of dice with any number of sides
        case 'roll':
            if(/^[0-9]{1,2}d[0-9]{1,5}$/i.test(parameters)) {
                var paramArray = parameters.match(/[0-9]+/);
                var rolls = paramArray[0];
                var sides = paramArray[1];
                var results = [];
                var cur = 0;
                for(var i = 0; i < rolls; i++) {
                    cur = Math.floor(Math.random() * sides) + 1;
                    results.push(cur);
                }
                message.channel.send(results);
            }
            else {
                message.channel.send("Please send a valid parameter. 'ndn'")
            }
        break;

        // Rock, Paper, Scissors!
        case 'rps':
            rpsOn = true;
        break;

        // To slap a user
        case 'slap':
            if(!getID(parameters[0])) { // Slap unsuccessful!
                message.channel.send(new Discord.RichEmbed()
                    .setColor("#FF004C")
                    .setImage("https://cdn.discordapp.com/attachments/380795482227867650/520802775609769984/slapmiss1.gif")                        
                    .setDescription(client.users.get(message.author.id).username + " is trying to make wind.")
                );
                break;
            }
            if(getID(parameters[0]) == client.user.id) { // To check if the target is BBC
                message.channel.send(new Discord.RichEmbed()
                    .setColor("#FF004C")
                    .setImage("https://cdn.discordapp.com/attachments/380795482227867650/520809468322381864/slaprobot.gif")
                    .setDescription(client.users.get(message.author.id).username + " slaps " + client.user.username + ".")
                )
                .then(message.channel.send('AH! What did I do?!'));
                break;
            }            
            message.channel.send(new Discord.RichEmbed() // Slap success!
                .setColor("#FF004C")
                .setImage('https://i.imgur.com/4MQkDKm.gif')
                .setDescription(client.users.get(message.author.id).username + " slaps " + message.guild.members.get(getID(parameters[0])).displayName + ".")
            );
        break;

        // To move a bulk of users in a voice channel to another
        case 'transport':
        case 'tp':
            if(message.author.voiceChannel) {
                message.channel.send(client.users.get(message.author.id).username + " is in the house!");
            }
        break;

        // Politely shuts down bot
        case 'END':
            message.delete(1)
            .then(message.channel.send("Eugh, I\'m feeling sleeping...zzz..."))
            .then(console.log("**Logging off...**"))
            .then(msg => client.destroy());
        break;
        
        /* Resets the bot (not updated with new code)
        case 'Reset':
        message.channel.send('Restarting...')
        .then(msg => client.destroy()) 
        .then(() => client.login("NTE4NTI0Njc2NjI1MDA2NjAy.DuSCeg.zFMYY4iIKG9824EC2PdRbJniQgU"));
        break; */

        // Jon's exclusive secret anonymous lick command
        case 'secretlick':
            /*if(message.author.id !== '159818886827474946') {   // Tests to see if the user is Jon
                break;
            } */
            message.delete(1);
            if(!/^<\@[0-9]+>$/.test(parameters)) {
                message.channel.send(new Discord.RichEmbed()
                    .setColor("#FFE600")
                    .setDescription("Faint slurping in the distance.")
                    .setImage("https://media0.giphy.com/media/3ov9k33jKFolcUnPnq/giphy.gif?cid=3640f6095c0b0e5d6f437555552f2288")
                );
                break;
            }
            targetUserID = /[0-9]+/.exec(parameters[0]);
            message.channel.send({embed: {
                color: 16770560,
                description: "A mysterious force licks " + message.guild.members.get(targetUserID.toString()).displayName//server.members.get(targetUserID.toString()).displayName + "."
            }});
        break;

        // To let the user know they wrote the command wrong and gives feedback accordingly
        default:
            message.channel.send("__**Unknown Command:**__ " + cmd);
            switch(cmd) {
                case 'hit':
                case 'h':
                case 'stand':
                case 'stay':
                case 's':
                case 'rock':
                case 'scissors':
                case 'paper':
                    message.channel.send("Don't use '~!'")
                break; 
            }
    }
}

//
//  SECONDARY FUNCTIONS
//

// Gets the ID of a user from a mention (Returns false if invalid user)
function getID(userTag){
    if(/^<\@[0-9]+>$/.test(userTag)) {
        return /[0-9]+/.exec(userTag).toString();
    }
    return false;
}

// Protocol for games (you don't use the prefix for environment clarity and convenience)
function talk2Bot(message) {
    if(blackjackOn) {
        curChannel = message.channel; // Keeps track of the channel
        switch(message.content) {
            // The user hits to draw            
            case 'hit': 
            case 'h':
                message.delete(1);
                bjDraw(uHand);
                userScore = bjScoreSum(uHand);
                curChannel.send(uHand[uHand.length-1]);
                if(checkWin(userScore, dealScore) !== null) {
                    message.channel.send(checkWin(userScore, dealScore));
                    blackjackOn = false;
                }
            break;

            // The user stands and the bot begins their turn
            case 'stand': 
            case 'stay':
            case 'stan':
            case 's':
                userStay = true;
                message.delete(1);
                if((dHand[0] == 'A' && (dHand[1] == 'J' || dHand[1] == 'Q' || dHand[1] == 'K')) || (dHand[1] == 'A' && (dHand[0] == 'J' || dHand[0] == 'Q' || dHand[0] == 'K'))) {
                    message.channel.send("Dealer got Blackjack! You lose!");
                    blackjackOn = false;
                    break;
                }
                while(dealScore < 17) {
                    bjDraw(dHand);
                    dealScore = bjScoreSum(dHand);
                    curChannel.send("Dealer hits:\n" + dHand[dHand.length-1]);
                    if(checkWin(userScore, dealScore) !== null) {
                        message.channel.send(checkWin(userScore, dealScore));
                        blackjackOn = false;
                        break;
                    }
                }
                if(blackjackOn) {
                    message.channel.send(checkWin(userScore, dealScore));
                    blackjackOn = false;
                }
        }
    }
}

// General Check for Win for the Games
function checkWin(score1,score2) {
    // Blackjack!!
    if(blackjackOn) {
        if(userStay) { // only after user stays or stands
            if(score2 > 21) {
                return `Dealer had: ${dHand}\nDealer busted with: +${score2 - 21}\nYou win!`;
            }
            else if(score1 > score2) {
                return `Dealer had: ${dHand}\nYou: ${score1} vs. Dealer: ${score2}\nYou win!!!`;
            }
            else if(score2 > score1) {
                return `Dealer had: ${dHand}\nYou: ${score1} vs. Dealer: ${score2}\nDealer wins!!!`;
            }
            else {
                return `Dealer had: ${dHand}\nYou: ${score1} vs. Dealer: ${score2}\nIt's a tie!`;
            }
        }
        else if(score1 > 21) { // to check if player busted
                return `Dealer had: ${dHand}\nYou busted with: +${score1 - 21} \nYou lose!`;
        }
        return null;
    }
    
    // Rock, Paper, Scissors!!
    if(rpsOn) {

    }
}

// Blackjack: Drawing a card
function bjDraw(hand) {

    // Picks the card value
    curCard = Math.floor(Math.random() * 13 + 1);
    switch(curCard) {
        case 1:
            curCard = 'A';
        break;
        case 11:
            curCard = 'J';
        break;
        case 12:
            curCard = 'Q';
        break;
        case 13:
            curCard = 'K';
    }

    // Picks the suit of the card
    suit = Math.floor(Math.random() * 4);
    switch(suit) {
        case 0:
            suit = ':spades:';
        break;
        case 1:
            suit = ':clubs:';
        break;
        case 2:
            suit = ':hearts:';
        break;
        case 3:
            suit = ':diamonds:';
    }
    hand.push(curCard+suit);
}


function bjScoreSum(hand) {
    sum = 0;
    for(i = 0; i < hand.length; i++) {
        cardNum = /[1][0]|[2-9]|[AJKQ]/.exec(hand[i]).toString();
        switch(cardNum) {
            case 'K':
            case 'Q':
            case 'J':
                cardNum = 10;
            break;
            case 'A':
                if(sum > 10) {
                    cardNum = 1;
                    break;
                }
                cardNum = 11;
        }
        sum+=cardNum;
    }
    return sum;
}