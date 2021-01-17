const targets = Array.from(game.user.targets);
if (targets.length != 1) {
  ui.notifications.error("Please target one token");
}
let target = targets[0];
const dc = target.actor.data.data.saves.fortitude.totalModifier + 10;
const roll = new Roll(`1d20 + ${actor.data.data.skills.ath.value}`).roll();
let degree = roll.total < dc ? 0 : 1;
if (roll.results[0] == 20) {
  degree++;
}
if (roll.results[0] == 1) {
  degree--;
}
let content;
switch (degree) {
  case -1:
    content = `<h3>Grapple <span style="color: red;">CRITICAL Fail</span></h3></p>${actor.data.name} is <b>Grabbed</b> or knocked <b>Prone</b></p>`;
    break;
  case 1:
    content = `<h3>Grapple <span style="color: green;">Success</span></h3></p>${target.actor.data.name} is <b>Grabbed</b></p>`;
    break;
  case 2:
    content = `<h3>Grappl <span style="color: green;">CRITICAL Success</span></h3></p>${target.actor.data.name} is <b>Restrained</b></p>`;
    break;
  default:
    content = '<h3>Grapple <span style="color: grey;">Fail</span></h3>';
    break;
}
let chatData = {
  user: game.user._id,
  speaker: ChatMessage.getSpeaker(),
};
ChatMessage.create({ ...chatData, roll, type: CHAT_MESSAGE_TYPES.ROLL }, {});
ChatMessage.create({ ...chatData, content }, {});
