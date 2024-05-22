const { sck, sck1,cmd, jsonformat, fetchJson, botpic, ffmpeg, TelegraPh, RandomXP, Config, tlang, warndb, sleep,getAdmin,getBuffer, prefix } = require('../lib')
const { mediafire } = require("../lib/mediafire.js");
const googleTTS = require("google-tts-api");
const ytdl = require('ytdl-secktor')
const fs = require('fs-extra')
const moment = require("moment-timezone");
const Levels = require("discord-xp");
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter");
var videotime = 60000 // 1000 min
var dlsize = 1000 // 1000mb
//---------------------------------------------------------------------------
cmd({
    pattern: "gdesc",
    alias : ['setgdesc','setdesc'],
    desc: "Set Description of Group",
    category: "group",
    filename: __filename,
    use: 'enter Description Text',
},
async(Void, citel, text,{ isCreator }) => {
    if (!citel.isGroup) return citel.reply(tlang().group);
    if(!text) return await citel.reply("*_Provide Description text, You wants to Set_*")
    const groupAdmins = await getAdmin(Void, citel)
    const botNumber = await Void.decodeJid(Void.user.id)
    const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
    const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
    if (!isBotAdmins) return await citel.reply(tlang().botAdmin); 
    if (!isAdmins) return citel.reply(tlang().admin);
    
    try {
        await Void.groupUpdateDescription(citel.chat, text);
        citel.reply('*_Group description Updated Successfuly!_*') 
        return await Void.sendMessage(citel.chat, { react: { text: '', key: citel.key }});
    } catch(e) { return await Void.sendMessage(users , {text :"Error While Updating Group Description\nReason : " + e, } ,{quoted : citel})   }
}
)

//---------------------------------------------------------------------------
cmd({
    pattern: "gname",
    alias: ['setgname','setname'],
    desc: "Set name of Group",
    category: "group",
    filename: __filename,
    use: 'enter Description Text',
},
async(Void, citel, text,{ isCreator }) => {
    if (!citel.isGroup) return citel.reply(tlang().group);
    if(!text) return await citel.reply("*_Provide Text To Update Group Name_*")
    const groupAdmins = await getAdmin(Void, citel)
    const botNumber = await Void.decodeJid(Void.user.id)
    const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
    const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
    if (!isBotAdmins) return await citel.reply(tlang().botAdmin); 
    if (!isAdmins) return citel.reply(tlang().admin);
    
    try {
        await Void.groupUpdateSubject(citel.chat, text)
        citel.reply('*_Group Name has been Updated Successfuly!_*') 
        return await Void.sendMessage(citel.chat, { react: { text: '', key: citel.key }});
    } catch(e) { return await Void.sendMessage(users , {text :"_Error While Updating Group Name_\nReason : " + e, } ,{quoted : citel})   }
}
)

//---------------------------------------------------------------------------
cmd({
    pattern: "request",
    desc: "Send a request message to the bot developer.",
    category: "user",
    usage: "request <your request message>",
}, async (Void, citel, text) => {
    if (!text) {
        await citel.reply("Please provide your request message. Example: .request Please fix or add a new feature.");
        return;
    }
    const developerNumber = '923096566451';
    const requestMessage = `*Request from ${citel.sender}*\n\n${text}`;
    await Void.sendMessage(developerNumber + "@s.whatsapp.net", { text: requestMessage }, { quoted: citel });
    await citel.reply("Your request has been sent to the bot developer. Thank you!");
});

    //---------------------------------------------------------------------------
cmd({
  pattern: "listonline",
  desc: "List all active members of the group",
  category: "group",
}, async (Void, citel, match) => {
  const groupMetadata = await citel.groupMetadata(citel.jid);
  const participants = groupMetadata.participants;

  const activeMembers = participants.filter((participant) => participant.isActive);
  const activeMemberNames = activeMembers.map((member) => `@${member.jid.split('@')[0]}`);
  const activeMemberCount = activeMembers.length;

  let response = `Active Members (${activeMemberCount}):\n`;
  response += activeMemberNames.join('\n');

  await citel.reply(response);
});

//---------------------------------------------------------------------------
cmd({
            pattern: "memegen",
            desc: "Write text on quoted image.",
            category: "group",
            filename: __filename,
            use: '<text>',
        },
        async(Void, citel, text) => {
            let mime = citel.quoted.mtype
            if (!/image/.test(mime)) return citel.reply(`Reply to Photo With Caption *text*`)
            mee = await Void.downloadAndSaveMediaMessage(citel.quoted)
            mem = await TelegraPh(mee)
            meme = await getBuffer(`https://api.memegen.link/images/custom/-/${text}.png?background=${mem}`)
            let buttonMessage = {
                image: meme,
                caption: "Here you go",
                footer: tlang().footer,
                headerType: 4,
            };
            Void.sendMessage(citel.chat, buttonMessage, {
                quoted: citel,
            });
            await fs.unlinkSync(mee)

        }
    )
//---------------------------------------------------------------------------
cmd({
            pattern: "del",
            alias: ["delete"],
            desc: "Deletes message of any user",
            category: "group",
            filename: __filename,
            use: '<quote/reply message.>',
        },
        async(Void, citel, text) => {
            if (citel.quoted.Bot) {
                const key = {
                    remoteJid: citel.chat,
                    fromMe: false,
                    id: citel.quoted.id,
                    participant: citel.quoted.sender
                }
                await Void.sendMessage(citel.chat, { delete: key })

            }
            if (!citel.quoted.isBot) {
                if (!citel.isGroup) return citel.reply(tlang().group)
                const groupAdmins = await getAdmin(Void, citel)
                const botNumber = await Void.decodeJid(Void.user.id)
                const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false;
                const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false;
                if (!isAdmins) return citel.reply('Only Admins are allowed to delete other persons message.')
                if (!isBotAdmins) return citel.reply('I can\'t delete anyones message without getting Admin Role.')
                if (!citel.quoted) return citel.reply(`Please reply to the message. ${tlang().greet}`);
                let { chat, fromMe, id } = citel.quoted;
                const key = {
                    remoteJid: citel.chat,
                    fromMe: false,
                    id: citel.quoted.id,
                    participant: citel.quoted.sender
                }
                await Void.sendMessage(citel.chat, { delete: key })
            }
        }
    )
//-------------------------------------------------------------------------------
cmd({
  pattern: "totag",
  desc: "Hide tags in a message",
  category: "group",
}, async (Void, citel) => {
  const mentioned = citel.mentionedIds;
  let hiddenTagMessage = citel.text;
  
  mentioned.forEach((mention) => {
    const mentionString = `@${mention.split('@')[0]}`;
    hiddenTagMessage = hiddenTagMessage.replace(mentionString, '');
  });

  await citel.sendMessage(citel.chat, hiddenTagMessage);
});


//--------------------------------------------------------------------------------
cmd({
  pattern: "broadcast",
  alias: ["bc"],
  desc: "Sends a broadcast message to all groups",
  fromMe: true,
  category: "group",
  filename: __filename,
  usage: "<text for broadcast>",
}, async (Void, citel, text) => {
  if (!isCreator) return citel.reply(tlang().owner);
  const groups = await Void.groupFetchAllParticipating();
  const activeGroups = groups.filter((group) => group.participants.length > 0); 
  citel.reply(`Preparing to send broadcast to ${activeGroups.length} group(s).`);
  for (const group of activeGroups) {
    try {
      await sleep(3000);
      const messageContent = {
        text: `*--❗ ${tlang().title} Broadcast ❗--*\n\n Author: ${citel.pushName}\n\n${text}`,
      };
      await Void.sendMessage(group.id, messageContent, { quoted: citel });
    } catch (error) {
      console.error(error);
      citel.reply(`Error sending broadcast to group: ${group.id}`);
    }
  }
  citel.reply(`Successfully broadcasted to ${activeGroups.length} group(s).`);
});
//-------------------------------------------
cmd({
  pattern: "left",
  desc: "Leaves the current group",
  category: "group",
}, async (Void, citel, text) => {
  try {
    const chatId = citel.chat;
    await Void.groupLeave(chatId);
    citel.reply("Successfully left the group🙂.");
  } catch (error) {
    console.error(error);
    citel.reply("Failed to leave the group.🤦🏽‍♂️");
  }
});

//---------------------------------------------------------------------------
cmd({

            pattern: "settings",           
            desc: "(setting list).",
            category: "owner",
            react: "⚙️",
            filename: __filename,
            use: '<text>',

        },

        async (Void,citel,text,{isCreator}) => {
       if(!isCreator) return citel.reply(tlang().owner);
        let buttons = [{

                    buttonId: `${prefix}system`,
                    buttonText: {
                    displayText: "System",
                    },

                    type: 1,
                },
                  {
                    buttonId: `${prefix}ping`,
                    buttonText: {
                    displayText: "Ping",

                    },
                    type: 1,
                },
            ];
            let buttonMessage = {
                image: {
                    url: 'https://telegra.ph/file/a6b9bbde7feaa92c69c7b.jpg',
                },

                caption: `

*⦁──🎃𝙎𝙀𝙏𝙏𝙄𝙉𝙂 𝙇𝙄𝙎𝙏📍──⦁*

1♻️➣ To put Antilink type :
Eg:- .setvar ANTILINK:false

2♻️➣ To on/off Auto reaction type :
Eg:- .setvar AUTO_REACTION:false/true

3♻️➣ To on/off Auto read status type : 
Eg:- .setvar AUTO_READ_STATUS:false/true

4♻️➣ To on/off Auto status save type :
Eg:- .setvar AUTO_STATUS_SAVER:false/true

5♻️➣ To on/off heroku type :
Eg:- .setvar heroku:false/true

6♻️➣ To put Heroku api key type :
Eg:- .setvar HEROKU_API_KEY:put api key

7♻️➣ To put Heroku app name type :
Eg:- .setvar HEROKU_APP_NAME:put app name

8♻️➣ To on/off Auto bio type :
Eg:- .setvar AUTO_BIO: false/true

9♻️➣ To on/off Auto reaction type :
Eg:- .setvar HEROKU_API_KEY:put api key

10♻️➣ To on/off Level up message type :
Eg:- .setvar LEVEL_UP_MESSAGE:false/true

11♻️➣ To put Mongodb url type :
Eg:- .setvar MONGODB_URI:put mongodb url

12♻️➣ To put Open api key type :
Eg:- .setvar OPENAI_API_KEY:put open api key

13♻️➣ To put Owner name type :
Eg:- .setvar OWNER_NUMBER:put any number

14♻️➣ To put Owner number type :
Eg:- .setvar OWNER_NUMBER:92xxxxxxxx

15♻️➣ To put Pack info type :
Eg:- .setvar PACK_INFO:put any name

16♻️➣ To put prefix type :
Eg:- .setvar PREFIX:.

17♻️➣ To on/off Auto Read message type :
Eg:- .setvar READ_MESSAGE:false/true

18♻️➣ To put thumb image type :
Eg:- .set THUMB_IMAGE:put image url

19♻️➣ To public/privert  type :
Eg:- .setvar WORKTYPE:public/private


©𝙂𝙀𝙉𝙀𝙍𝘼𝙏𝙀𝘿 𝘽𝙔 𝙆𝙄𝙉𝙂-𝙈𝘿
`,

                footer: tlang().footer,
                headerType: 4,
            };
            return Void.sendMessage(citel.chat, buttonMessage, {
                quoted: citel,
            });
        }
    )

cmd({

            pattern: "heroku",           
            alias :['herokucc','herokubin','hbin'],
            desc: "(menu cmdlist).",
            category: "general",
            react: "💌",
            filename: __filename,
            use: '<faded-Alan walker.>',

        },

        async(Void, citel, text) => {
        let buttons = [{

                    buttonId: `${prefix}system`,
                    buttonText: {
                    displayText: "System",
                    },

                    type: 1,
                },
                  {
                    buttonId: `${prefix}ping`,
                    buttonText: {
                    displayText: "Ping",

                    },
                    type: 1,
                },
            ];
            let buttonMessage = {
                image: {
                    url: await botpic(),
                },

                caption: `
 *heroku account bins*


FIRST NAME : You Name

SECOND NAME : You Name

COUNTRY : US

ADDRESS 1 : Any Address
CITY : NEW YORK

STATE : NEW YORK

ZIP CODE : 10089

514812100967xx

514812100953xx

5148121009726403|08|2025|818

5148121009768132|08|2025|676

5148121009870383|08|2025|511

5148121009806742|08|2025|766

5148121009557634|08|2025|641

5148121009825403|08|2025|346

5148121009806072|08|2025|546

*By King Md👑*
`,

                footer: tlang().footer,
                headerType: 4,
            };
            return Void.sendMessage(citel.chat, buttonMessage, {
                quoted: citel,
            });
        }
    )
            
cmd({
        pattern: "supportgc",
        desc: "Sends official support group link.",
        category: "user",
        filename: __filename,
    },
    async(Void, citel, text) => {
        citel.reply(`*Check your DM I LEFT SOMETHING THERE🤭 ${tlang().greet}*`);
        await Void.sendMessage(`${citel.sender}`, {
            image: log0,
            caption: `*Name: King-Support*\n*Link:* https://whatsapp.com/channel/0029Va66s2IJENxvTJjUtM1w`,
        });

    }
)

cmd({

            pattern: "support",           
            alias :['supp','wasupp','ownersupp'],
            desc: "(menu cmdlist).",
            category: "user",
            react: "😏",
            filename: __filename,
            use: '<faded-Alan walker.>',

        },

        async(Void, citel, text) => {
        let buttons = [{

                    buttonId: `${prefix}system`,
                    buttonText: {
                    displayText: "System",
                    },

                    type: 1,
                },
                  {
                    buttonId: `${prefix}ping`,
                    buttonText: {
                    displayText: "Ping",

                    },
                    type: 1,
                },
            ];
            let buttonMessage = {
                image: {
                    url: await botpic(),
                },

                caption: `
 KING Md WhatsApp Bot

 Official Support Channel
 
https://whatsapp.com/channel/0029Va66s2IJENxvTJjUtM1w

*By King Md👑*
`,

                footer: tlang().footer,
                headerType: 4,
            };
            return Void.sendMessage(citel.chat, buttonMessage, {
                quoted: citel,
            });
        }
    )
