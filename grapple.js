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
  const dc = target.actor.data.data.saves.fortitude.totalModifier + 10;
  const roll = new Roll(`1d20 + ${actor.data.data.skills.ath.value} - ${map}`).roll();
  const difference = roll.total - dc;
  let degree = difference < 0 ? 0 : 1;
  if (roll.dice[0] == 20 || difference >= 10) {
    degree++;
  } else if (roll.dice[0] == 1 || difference <= -10) {
    degree--;
  }
  let content;
  switch (degree) {
    case -1:
      content = `<h3>Grapple <span style="color: red;">❌❌CRITICAL Fail</span></h3></p>${actor.data.name} is <b>Grampendium[pf2e.conditionitems.kWc1fhmv9LBiTuei]{Grabbed} or knocked <b>@Compendium[pf2e.conditionitems.kWc1fhmv9LBiTuei]{Prone}</p>`;
      break;
    case 0:
      content = '<h3>Grapple <span style="color: grey;">❌Fail</span></h3>';
      break;
    case 1:
      content = `<h3>Grapple <span style="color: green;">✔️Success</span></h3></p>${target.actor.data.name} is <b>@Compendium[pf2e.conditionitems.kWc1fhmv9LBiTuei]{Grabbed}</b></p>`;
      break;
    case 2:
      content = `<h3>Grapple <span style="color: green;">✔️✔️CRITICAL Success</span></h3></p>${target.actor.data.name} is <b>$Compendium[pf2e.conditionitems.kWc1fhmv9LBiTuei]{Restrained}}</b></p>`;
      break;
  }
  let chatData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
  };
  ChatMessage.create({ ...chatData, content }, {});
}