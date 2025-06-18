// JS logic for recording alet mediaRecorder;
let audioChunks = [];

document.addEventListener("DOMContentLoaded", () => {
  const recordBtn = document.getElementById("record");
  const stopBtn = document.getElementById("stop");
  const insertBtn = document.getElementById("insert");
  const audioPreview = document.getElementById("audioPreview");

  stopBtn.disabled = true;
  insertBtn.disabled = true;

  recordBtn.onclick = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      const base64 = await blobToBase64(blob);

      // Vorschau anzeigen
      audioPreview.innerHTML = `
        <audio controls>
          <source src="${base64}" type="audio/webm">
          Your browser does not support the audio tag.
        </audio>
      `;

      insertBtn.disabled = false;
    };

    audioChunks = [];
    mediaRecorder.start();
    recordBtn.disabled = true;
    stopBtn.disabled = false;
  };

  stopBtn.onclick = () => {
    mediaRecorder.stop();
    stopBtn.disabled = true;
    recordBtn.disabled = false;
  };

  insertBtn.onclick = () => {
    const emailBody = `
      <p>🎤 Sprachmemo:</p>
      <audio controls>
        <source src="${audioPreview.querySelector('source').src}" type="audio/webm">
        Your browser does not support the audio tag.
      </audio>
    `;

    Office.context.mailbox.item.body.setSelectedDataAsync(
      emailBody,
      { coercionType: Office.CoercionType.Html },
      (result) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          console.log("Audio eingefügt");
        } else {
          console.error(result.error);
        }
      }
    );
  };
});

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
nd inserting voice memo
