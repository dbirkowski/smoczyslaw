// @ts-check
const Telegram = require('telegram-node-bot');
const request = require('request');
const moment = require('moment');

const TelegramBaseController = Telegram.TelegramBaseController;
const TextCommand = Telegram.TextCommand;
const token = '<paste the token here>';
const tg = new Telegram.Telegram(token, {});

const mdlaUrl = 'https://script.google.com/macros/s/AKfycbxpEvdoj09IZ3vWsBKKxcL1BAxDb0alUjcpVkHiYuDCRG6Q6Q8/exec';

const resultHandlers = {
  /**
   * Provide results for Carcassonne
   * @param {string} results Results from the game
   * @returns string
   */
  carcassonne(text) {
    const results = /^\/wyniki\s-c\s(\d+)\s(\d+)\s(\d+)\s(\d+)/g.exec(text);
    if (results && results.length > 4) {
      const [aga, lukasz, michal, damian] = results.slice(1, 5);
      return 'Wyniki dodane.';
    }
    return 'Jakis blad.';
  },
  munchkin(text) {
    const results = /^\/wyniki\s-m\s(aga|damian|micha[lł]|[lł]ukasz)/gi.exec(text);
    if (results && results.length > 1) {
      const winner = results[1];
      return 'Wyniki dodane.';
    }
    return 'Jakis blad.';
  },
  siedemCudow(text, $) {
    const form = {
      aga: {
        q: 'Podaj wyniki dla Agi. Wpisz /wyniki <wojsko> <kasa> <etapy> <N> <Ż> <F> <Z>',
        error: 'Cos poszlo nie tak :( Wpisz "stop" zeby zatrzymac',
        validator: (message, callback) => {
          console.info(message.text);
          if (message.text.includes('stop')) {
            $.sendMessage('Pierdol sie. KROPKA NIENAWISCI.', { parse_mode: 'Markdown' });
            return;
          }
          if (message.text && /\d+\s\d+\s\d+\s\d+\s\d+\s\d+\s\d+/g.test(message.text)) {
            callback(true, message.text); // you must pass the result also
            return;
          }

          callback(false);
        },
      },
      michal: {
        q: 'Podaj wyniki dla Michała. Wpisz /wyniki <wojsko> <kasa> <etapy> <N> <Ż> <F> <Z>',
        error: 'Cos poszlo nie tak :( Wpisz "stop" zeby zatrzymac',
        validator: (message, callback) => {
          console.info(message.text);
          if (message.text.includes('stop')) {
            $.sendMessage('Pierdol sie. KROPKA NIENAWISCI.', { parse_mode: 'Markdown' });
            return;
          }
          if (message.text && /\d+\s\d+\s\d+\s\d+\s\d+\s\d+\s\d+/g.test(message.text)) {
            callback(true, message.text); // you must pass the result also
            return;
          }

          callback(false);
        },
      },
      lukasz: {
        q: 'Podaj wyniki dla Łukasza. Wpisz /wyniki <wojsko> <kasa> <etapy> <N> <Ż> <F> <Z>',
        error: 'Cos poszlo nie tak :( Wpisz "stop" zeby zatrzymac',
        validator: (message, callback) => {
          console.info(message.text);
          if (message.text.includes('stop')) {
            $.sendMessage('Pierdol sie. KROPKA NIENAWISCI.', { parse_mode: 'Markdown' });
            return;
          }
          if (message.text && /\d+\s\d+\s\d+\s\d+\s\d+\s\d+\s\d+/g.test(message.text)) {
            callback(true, message.text); // you must pass the result also
            return;
          }

          callback(false);
        },
      },
      damian: {
        q: 'Podaj wyniki dla Damiana. Wpisz /wyniki <wojsko> <kasa> <etapy> <N> <Ż> <F> <Z>',
        error: 'Cos poszlo nie tak :( Wpisz "stop" zeby zatrzymac',
        validator: (message, callback) => {
          console.info(message.text);
          if (message.text.includes('stop')) {
            $.sendMessage('Pierdol sie. KROPKA NIENAWISCI.', { parse_mode: 'Markdown' });
            return;
          }
          if (message.text && /\d+\s\d+\s\d+\s\d+\s\d+\s\d+\s\d+/g.test(message.text)) {
            callback(true, message.text); // you must pass the result also
            return;
          }

          callback(false);
        },
      },
    };

    $.runForm(form, (result) => {
      console.log(result);
      $.sendMessage('Wyniki dodane.', { parse_mode: 'Markdown' });
    });
  },
};

function requestData($, cb) {
  request.get({
    json: true,
    headers: { 'User-Agent': 'request' },
    url: mdlaUrl,
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      const response = cb(data);
      $.sendMessage(response, { parse_mode: 'Markdown' });
    }
  });
}

function getLast(data) {
  const last = data.pop();
  const id = last.Id;
  const name = last['Nazwa pokoju'];
  const house = last['Nazwa domu'];
  const date = new Date(last.Data);
  const time = last.Czas;
  const clues = last.Podpowiedzi;
  const dateString = moment(date).format('DD/MM/YYYY');
  return `Ostatnio byliśmy w *${name}* dnia ${dateString}.\nPokój zrobiliśmy w *${time}* i wykorzystaliśmy *${clues}* podpowiedzi.\nBył to nasz *${id}* pokój.`;
}

function getRandomPerson() {
  const pseudoRandom = Math.floor(Math.random() * 4);
  switch (pseudoRandom) {
    case 0:
      return 'Michał';
    case 1:
      return 'Damian';
    case 2:
      return 'Aga';
    case 3:
      return 'Łukasz';
    default:
      return 'yyy nie wiem';
  }
}

function getDirection() {
  const pseudoRandom = Math.floor(Math.random() * 4);
  switch (pseudoRandom) {
    case 0:
      return '\uD83D\uDC46'; // up
    case 1:
      return '\uD83D\uDC47'; // down
    case 2:
      return '\uD83D\uDC48'; // left
    case 3:
      return '\uD83D\uDC49'; // right
    default:
      return 'nie wiem :/';
  }
}

class MsgController extends TelegramBaseController {
  /**
   * @param {Scope} $
   */
  lastVisit($) {
    $.sendMessage('pobieram, czekaj...');
    requestData($, getLast);
  }

  whosFirst($) {
    const randomPerson = getRandomPerson();
    const msg = `Zaczyna *${randomPerson}*!`;
    $.sendMessage(msg, { parse_mode: 'Markdown' });
  }

  whereGoesTheDragon($) {
    const direction = getDirection();
    const msg = `Smok idzie *${direction}*`;
    $.sendMessage(msg, { parse_mode: 'Markdown' });
  }

  results($) {
    const text = $.message.text;
    console.info(text);
    const command = /^\/wyniki\s(-[hc7m])/g.exec(text);
    const help = [
      '```',
      '-h                   Pokaz pomoc',
      '-7                   Rozpocznij dodawanie wynikow z 7 Cudow Swiata',
      '-c <A> <M> <L> <D>   Dodaj wyniki z Carcassonne',
      '-m <zwyciezca>       Dodaj wynik z Munchkina',
      '```',
    ].join('\n');
    let msg;

    if (command && command[1]) {
      switch (command[1]) {
        case '-c':
          msg = resultHandlers.carcassonne(text);
          break;
        case '-m':
          msg = resultHandlers.munchkin(text);
          break;
        case '-7':
          resultHandlers.siedemCudow(text, $);
          break;
        default:
          $.sendMessage(help, { parse_mode: 'Markdown' });
          break;
      }
      if (msg) $.sendMessage(msg, { parse_mode: 'Markdown' });
    } else {
      $.sendMessage(help, { parse_mode: 'Markdown' });
    }
  }

  get routes() {
    return {
      lastVisit: 'lastVisit',
      whosFirst: 'whosFirst',
      whereGoesTheDragon: 'whereGoesTheDragon',
      results: 'results',
    };
  }
}

class OtherwiseController extends TelegramBaseController {
  /**
   * @param {Scope} $
   */
  handle($) {
    $.sendMessage('Co tu się odsmerfia? Ja nie paniemaju. Traj egejn.');
  }
}

tg.router
  .when(new TextCommand('/kiedyostatnio', 'lastVisit'), new MsgController())
  .when(new TextCommand('/ktopierwszy', 'whosFirst'), new MsgController())
  .when(new TextCommand('/idzsesmoku', 'whereGoesTheDragon'), new MsgController())
  .when(new TextCommand('/wyniki', 'results'), new MsgController())
  .otherwise(new OtherwiseController());
