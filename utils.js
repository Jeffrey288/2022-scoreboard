function msToString(ms) {
  const centisec = ("0" + Math.floor((ms % 1000) / 10)).slice(-2);
  const sec = ("0" + Math.floor((ms / 1000) % 60)).slice(-2);
  const min = ("0" + Math.floor(ms / 60 / 1000)).slice(-2);
  return `${min}:${sec}.${centisec}`;
}

function toIsoString(date) {
  const tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      const norm = Math.floor(Math.abs(num));
      return (norm < 10 ? "0" : "") + norm;
    };

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    dif +
    pad(tzo / 60) +
    ":" +
    pad(tzo % 60)
  );
}

function saveToJSON(obj, filename = "result.json") {
  var a = document.createElement("a");
  a.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(obj))
  );
  a.setAttribute("download", filename);
  a.click();
}

function saveResult(names, scores, records) {
  const result = {
    createdAt: toIsoString(new Date()),
    data: {
      red: {
        name: names.red,
        finalScore: scores.red.final,
        greatVictory: scores.red.greatVictory,
        win: scores.red.win,
        records: records.red,
      },
      blue: {
        name: names.blue,
        finalScore: scores.blue.final,
        greatVictory: scores.blue.greatVictory,
        win: scores.blue.win,
        records: records.blue,
      },
    },
  };
  saveToJSON(result, "result.json");
}

export { msToString, saveResult };
