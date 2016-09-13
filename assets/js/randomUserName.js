
/*create random id using alphabets and numbers*/
function makeid(numChar)
  {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for( var i=0; i < numChar; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
  }

function chooseOne(arr)
  {
      return arr[Math.floor(Math.random()*arr.length)];
  }

function randomUsername()
{
  var ADJECTIVES = [
      'Abrasive', 'Brash', 'Callous', 'Daft', 'Eccentric', 'Fiesty', 'Golden',
      'Holy', 'Ignominious', 'Joltin', 'Killer', 'Luscious', 'Mushy', 'Nasty',
      'OldSchool', 'Pompous', 'Quiet', 'Rowdy', 'Sneaky', 'Tawdry',
      'Unique', 'Vivacious', 'Wicked', 'Xenophobic', 'Yawning', 'Zesty'
  ];

  var XMEN = ['ProfessorX','Beast','Colossus','Cyclops','Iceman','MarvelGirl','Storm',
                'Wolverine','Shadowcat','Nightcrawler','Rogue','Angel','Dazzler','Syndicate','Magician',
                'Bishop','Pyro','Psylocke','Toad','Firestar'];



      return chooseOne(ADJECTIVES) + chooseOne(XMEN) ;//+ "-" +makeid(4);
}
