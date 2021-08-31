const targets = Array.from(game.user.targets);
if (targets.length != 1) {
  ui.notifications.error("Please target one token");
  return;
}
new Dialog({
  title: `Whirling Throw`,
  buttons: {
    first: {
      label: "1d6",
      callback: () => whirlingThrow(1),
    },
    second: {
      label: "2d6",
      callback: () => whirlingThrow(2),
    },
    third: {
      label: "3d6",
      callback: () => whirlingThrow(3),
    },
  },
  default: "third",
}).render(true);

function whirlingThrow(dice) {
  let target = targets[0];
  const dc = target.actor.data.data.saves.fortitude.totalModifier + 10;
  const check = new Roll(`1d20 + ${actor.data.data.skills.ath.value}`).roll();
  const difference = check.total - dc;
  let degree = difference < 0 ? 0 : 1;
  if (check.dice[0] == 20 || difference >= 10) {
    degree++;
  } else if (check.dice[0] == 1 || difference <= -10) {
    degree--;
  }
  let content;
  switch (degree) {
    case -1:
      content = `<h3>Whirling Throw <span style="color: red;">❌❌ CRITICAL Fail</span></h3><p>${target.actor.data.name} escapes!</p>`;
      break;
    case 0:
      content = '<h3>Whirling Throw <span style="color: grey;">❌ Fail</span></h3>';
      break;
    case 1:
      content = `<h3>Whirling Throw <span style="color: green;">✔️ Success</span></h3>`;
      break;
    case 2:
      content = `<h3>Whirling Throw <span style="color: green;">✔️✔️ CRITICAL Success</span></h3><p>${target.actor.data.name} lands <b>@Compendium[pf2e.conditionitems.kWc1fhmv9LBiTuei]{Prone}</p>`;
      break;
  }
  let chatData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
  };
  ChatMessage.create({ ...chatData, content }, {});
  if(degree>0){
    const damageRoll = new Roll(`(${dice}d6 + ${actor.data.data.abilities.str.mod})[bludgeoning damage]`).roll();
    ChatMessage.create({ ...chatData, roll: damageRoll, type: 5 }, {});
  }
}