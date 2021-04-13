const targets = Array.from(game.user.targets);
if (targets.length != 1) {
  ui.notifications.error("Please target one token");
}
new Dialog({
  title: `Grapple`,
  buttons: {
    first: {
      label: "1st attack",
      callback: () => grapple(0),
    },
    second: {
      label: "2nd attack",
      callback: () => grapple(5),
    },
    third: {
      label: "3rd attack",
      callback: () => grapple(10),
    },
  },
  default: "first",
}).render(true);

function grapple(map) {
  let target = targets[0];
  const dc = target.actor.data.data.saves.reflex.totalModifier + 10;
  const roll = new Roll(`1d20 + ${actor.data.data.skills.ath.value} - ${map}`).roll();
  const difference = roll.total - dc;
  let degree = difference < 0 ? 0 : 1;
  if (roll.results[0] == 20 || difference >= 10) {
    degree++;
  } else if (roll.results[0] == 1 || difference <= -10) {
    degree--;
  }
  let content;
  switch (degree) {
    case -1:
      content = `<h3>Grapple <span style="color: red;">❌❌ CRITICAL Fail</span></h3></p>${actor.data.name} is knocked&npbsp;@Compendium[pf2e.conditionitems.kWc1fhmv9LBiTuei]{Prone}</p>`;
      break;
    case 0:
      content = '<h3>Grapple <span style="color: grey;">❌ Fail</span></h3>';
      break;
    case 1:
      content = `<h3>Grapple <span style="color: green;">✔️ Success</span></h3></p>${target.actor.data.name} is knocked&nbsp;@Compendium[pf2e.conditionitems.kWc1fhmv9LBiTuei]{Prone}</p>`;
      break;
    case 2:
      content = `<h3>Grapple <span style="color: green;">✔️✔️ CRITICAL Success</span></h3></p>${target.actor.data.name} is knocked&nbsp;@Compendium[pf2e.conditionitems.kWc1fhmv9LBiTuei]{Prone} and takes 1d6 damage</p>`;
      break;
  }
  let chatData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
  };
  ChatMessage.create({ ...chatData, roll, type: CHAT_MESSAGE_TYPES.ROLL }, {});
  if (degree == 2) {
    const damageRoll = new Roll("1d6").roll();
    ChatMessage.create({ ...chatData, roll: damageRoll, type: CHAT_MESSAGE_TYPES.ROLL }, {});
  }
  ChatMessage.create({ ...chatData, content }, {});
}
