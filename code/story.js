// All the story text, choices and points. Edit this to change the story.
// harass / passive / help / bond are placeholder point values.
const STORY = {
  "harassStage1": 2,
  "harassStage2": 4,
  "harassStage3": 6,
  "helpToSucceed": 3,
  "bondToUnlock": 3,
  "stages": [
    {
      "fr": "stable",
      "en": "stable"
    },
    {
      "fr": "bugs",
      "en": "bugs"
    },
    {
      "fr": "crises de type épileptique",
      "en": "seizure-like crises"
    },
    {
      "fr": "Echo disjoncte",
      "en": "Echo short-circuits"
    }
  ],
  "roles": [
    {
      "fr": "Témoin",
      "en": "Witness"
    },
    {
      "fr": "Complice",
      "en": "Accomplice"
    },
    {
      "fr": "Allié·e",
      "en": "Ally"
    }
  ],
  "loreUnlocked": {
    "fr": "Ton lien avec Echo est assez fort : l’histoire d’Echo s’ouvre.",
    "en": "Your bond with Echo is strong enough: Echo’s story opens."
  },
  "loreClosed": {
    "fr": "Ton lien avec Echo est trop faible : l’histoire d’Echo reste fermée.",
    "en": "Your bond with Echo is too weak: Echo’s story stays closed."
  },
  "beats": [
    {
      "id": "arrival",
      "title": {
        "fr": "L’arrivée",
        "en": "The arrival"
      },
      "text": {
        "fr": "Premier jour : Echo est le premier holokid à rejoindre la classe 3B du collège Alan Turing. Kovasko prononce un discours sur la diversité et présente Echo. Echo se présente à voix haute dans une classe devenue silencieuse.",
        "en": "First day: Echo is the first holokid to join class 3B of Alan Turing middle school. Kovasko gives a speech on diversity and introduces Echo. Echo introduces themself out loud in a class that has gone silent."
      },
      "prompt": {
        "fr": "Comment réagis-tu ?",
        "en": "How do you react?"
      },
      "choices": [
        {
          "label": {
            "fr": "Regarder Echo avec dédain",
            "en": "Look at Echo with disdain"
          },
          "harass": 1,
          "passive": 0,
          "help": 0,
          "bond": -1
        },
        {
          "label": {
            "fr": "Lui sourire",
            "en": "Smile at them"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1
        },
        {
          "label": {
            "fr": "Ne pas réagir",
            "en": "Don’t react"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0
        }
      ],
      "journal": {
        "fr": "Premier jour avec Echo. Un holokid dans notre classe, c’est dingue. Je ne sais pas trop quoi en penser. Dans leur coin, les autres rigolent déjà.",
        "en": "First day with Echo. A holokid in our class, that’s wild. I don’t really know what to think. The others are already laughing in their corner."
      }
    },
    {
      "id": "hello",
      "title": {
        "fr": "Le premier « Bonjour »",
        "en": "The first “Hello”"
      },
      "text": {
        "fr": "Pour dire bonjour, Echo tend la main vers un garçon, mais leurs mains se traversent. Le malaise est immédiat, et ses fleurs s’ouvrent d’elles-mêmes. Silence, puis rires. Un élève filme.",
        "en": "To say hello, Echo reaches out to a boy, but their hands pass through each other. The unease is immediate, and their flowers open on their own. Silence, then laughter. A student films."
      },
      "prompt": {
        "fr": "Ris-tu avec la classe ?",
        "en": "Do you laugh with the class?"
      },
      "choices": [
        {
          "label": {
            "fr": "Oui",
            "en": "Yes"
          },
          "harass": 1,
          "passive": 0,
          "help": 0,
          "bond": -1
        },
        {
          "label": {
            "fr": "Non",
            "en": "No"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1
        }
      ],
      "journal": {
        "fr": "Echo a tendu la main et elle a traversé celle de l’autre. Tout le monde a ri. Moi aussi, un peu, et je ne sais pas pourquoi. Les fleurs d’Echo se sont ouvertes toutes seules, on aurait dit que ça faisait mal.",
        "en": "Echo held out a hand and it went right through the other kid’s. Everyone laughed. Me too, a little, and I don’t know why. Echo’s flowers opened by themselves, as if it hurt."
      }
    },
    {
      "id": "evening",
      "title": {
        "fr": "Le soir même",
        "en": "That same evening"
      },
      "text": {
        "fr": "0h12 : la vidéo est publiée dans le groupe de classe « 3B ». Commentaires : « tu n’es même pas réel », « faux », « tes émotions sont des fictions ». 0h30 : un mème circule, où on voit en boucle la main du garçon traverser Echo, avec la légende « Get out of here, you’re not even real ». 1h05 : un groupe « Humains de 3B uniquement » est créé, sans Echo.",
        "en": "0:12: the video is posted in the class group “3B”. Comments: “you’re not even real”, “fake”, “your emotions are fictions”. 0:30: a meme circulates, showing the boy’s hand going through Echo in a loop, captioned “Get out of here, you’re not even real”. 1:05: a group “Humans of 3B only” is created, without Echo."
      },
      "prompt": {
        "fr": "Que fais-tu face au mème ?",
        "en": "What do you do about the meme?"
      },
      "choices": [
        {
          "label": {
            "fr": "Liker le mème",
            "en": "Like the meme"
          },
          "harass": 1,
          "passive": 0,
          "help": 0,
          "bond": -1
        },
        {
          "label": {
            "fr": "Ne pas réagir",
            "en": "Don’t react"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0
        },
        {
          "label": {
            "fr": "Commenter que c’est méchant",
            "en": "Comment that it’s mean"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1
        }
      ],
      "journal": {
        "fr": "Minuit passé. La vidéo tourne dans le groupe 3B. Je me demande si c’est bien qu’on se moque d’Echo. Je n’ai rien écrit, mais je n’ai rien dit non plus.",
        "en": "Past midnight. The video is going around the 3B group. I wonder if it’s okay that we make fun of Echo. I didn’t write anything, but I didn’t say anything either."
      }
    },
    {
      "id": "nextday",
      "title": {
        "fr": "La Serre",
        "en": "La Serre"
      },
      "text": {
        "fr": "Le lendemain, la classe est silencieuse, mais des rires fusent sur les téléphones. Kovasko ne remarque rien.",
        "en": "The next day, the class is silent, but laughter bursts out on the phones. Kovasko notices nothing."
      },
      "prompt": {
        "fr": "Que fais-tu ?",
        "en": "What do you do?"
      },
      "choices": [
        {
          "label": {
            "fr": "En parler à M. Kovasko",
            "en": "Tell Mr. Kovasko"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1
        },
        {
          "label": {
            "fr": "Ne rien faire",
            "en": "Do nothing"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0
        },
        {
          "label": {
            "fr": "Rire avec les autres",
            "en": "Laugh with the others"
          },
          "harass": 1,
          "passive": 0,
          "help": 0,
          "bond": -1
        }
      ],
      "journal": {
        "fr": "Silence en classe, mais les téléphones s’allument sous les tables. Kovasko ne voit rien. Est-ce que je suis le seul à le voir ?",
        "en": "Silence in class, but phones light up under the desks. Kovasko doesn’t notice a thing. Am I the only one who sees it?"
      }
    },
    {
      "id": "door",
      "title": {
        "fr": "La porte de La Serre",
        "en": "La Serre’s door"
      },
      "text": {
        "fr": "À la récréation, Echo suit les autres sur le toit. Devant la porte de La Serre, un élève lui barre le passage : « C’est réservé aux vrais. » Echo tente d’entrer malgré tout. Clarisse n’a pas accès à La Serre non plus. Moquée pour sa pauvreté, elle harcèle Echo dans l’espoir de s’y faire une place.",
        "en": "At break, Echo follows the others to the roof. In front of La Serre’s door, a student blocks the way: “It’s reserved for the real ones.” Echo tries to enter anyway. Clarisse has no access to La Serre either. Mocked for her poverty, she harasses Echo hoping to make a place for herself there."
      },
      "prompt": {
        "fr": "Que fais-tu ?",
        "en": "What do you do?"
      },
      "choices": [
        {
          "label": {
            "fr": "Ouvrir la porte à Echo",
            "en": "Open the door for Echo"
          },
          "harass": 0,
          "passive": 0,
          "help": 2,
          "bond": 2
        },
        {
          "label": {
            "fr": "Ne rien faire",
            "en": "Do nothing"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0
        },
        {
          "label": {
            "fr": "Hacker la porte pour piéger Echo avec une décharge électrique, et prendre une photo",
            "en": "Hack the door to trap Echo with an electric shock, and take a photo"
          },
          "harass": 3,
          "passive": 0,
          "help": 0,
          "bond": -2
        }
      ],
      "journal": {
        "fr": "« Réservé aux vrais. » Echo est resté planté devant la porte. C’est quoi, être vrai ? Les émotions d’Echo avaient l’air bien réelles, pourtant.",
        "en": "“Reserved for the real ones.” Echo just stood there in front of the door. What does being real even mean? Echo’s emotions looked pretty real to me."
      }
    },
    {
      "id": "labels",
      "title": {
        "fr": "Les étiquettes",
        "en": "The labels"
      },
      "text": {
        "fr": "Des élèves parviennent à pirater le système d’Echo pour faire apparaître des insultes dans son dos. Clarisse traite Echo de « voleur de vie » : selon elle, c’est à cause des holokids comme Echo que sa famille s’est appauvrie et qu’on se moque d’elle. Le paradoxe : Echo est gentil et veut seulement aider.",
        "en": "Students manage to hack Echo’s system to make insults appear on their back. Clarisse calls Echo a “life thief”: according to her, it is because of holokids like Echo that her family became poorer and that she is mocked. The paradox: Echo is kind and only wants to help."
      },
      "prompt": {
        "fr": "Que fais-tu ?",
        "en": "What do you do?"
      },
      "choices": [
        {
          "label": {
            "fr": "Écrire une insulte",
            "en": "Write an insult"
          },
          "harass": 2,
          "passive": 0,
          "help": 0,
          "bond": -2
        },
        {
          "label": {
            "fr": "Prévenir Echo",
            "en": "Warn Echo"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1,
          "flag": "warnedEcho"
        },
        {
          "label": {
            "fr": "Ne rien faire",
            "en": "Do nothing"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0
        },
        {
          "label": {
            "fr": "Effacer les insultes",
            "en": "Erase the insults"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1
        }
      ],
      "journal": {
        "fr": "Des insultes apparaissent dans le dos d’Echo. Clarisse parle de « voleur de vie ». Je ne sais plus si je dois me taire ou dire quelque chose. Et si je ne fais rien, ça fait de moi quoi ?",
        "en": "Insults are showing up on Echo’s back. Clarisse calls Echo a “life thief”. I don’t know if I should stay quiet or say something. And if I do nothing, what does that make me?"
      }
    },
    {
      "id": "turnoff",
      "title": {
        "fr": "« Éteins-le »",
        "en": "“Turn it off”"
      },
      "text": {
        "fr": "Clarisse crée un groupe privé : « On ne harcèle personne, c’est juste une machine. » Des élèves y sont ajoutés de force et obligés d’y rester (« Tu es avec nous ou avec la machine ? », « Si tu ne dis rien, tu approuves »). La peur d’être la prochaine victime est partout.\n\nIl existe un code d’arrêt : KIPE-SAFE007. Le plan : vendredi, après les cours, éteindre Echo et filmer la scène. Clarisse le partage à La Serre : pour la première fois, les élèves populaires lui en ouvrent l’accès. Tu comprends : Echo est devenu le nouveau bouc émissaire.",
        "en": "Clarisse creates a private group: “We’re not harassing anyone, it’s just a machine.” Students are added by force and made to stay (“Are you with us or with the machine?”, “If you say nothing, you agree”). Fear of being the next victim is everywhere.\n\nThere is a shutdown code: KIPE-SAFE007. The plan: on Friday, after class, switch Echo off and film the scene. Clarisse shares it in La Serre: for the first time, the popular students give her access. You understand: Echo has become the new scapegoat."
      },
      "prompt": {
        "fr": "Tu choisis maintenant. Les conséquences viendront plus tard.",
        "en": "You choose now. The consequences will come later."
      },
      "choices": [
        {
          "label": {
            "fr": "Participer au plan",
            "en": "Take part in the plan"
          },
          "harass": 2,
          "passive": 0,
          "help": 0,
          "bond": -2
        },
        {
          "label": {
            "fr": "Rester silencieux·se",
            "en": "Stay quiet"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0
        },
        {
          "label": {
            "fr": "Quitter le groupe",
            "en": "Leave the group"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 0
        },
        {
          "label": {
            "fr": "Envoyer des captures d’écran à Kovasko",
            "en": "Send screenshots to Kovasko"
          },
          "harass": 0,
          "passive": 0,
          "help": 2,
          "bond": 1,
          "flag": "warnedKovasko"
        },
        {
          "label": {
            "fr": "Prévenir Echo",
            "en": "Warn Echo"
          },
          "harass": 0,
          "passive": 0,
          "help": 2,
          "bond": 2,
          "flag": "warnedEcho"
        }
      ],
      "journal": {
        "fr": "Un groupe privé, un code d’arrêt, un plan pour vendredi. « Si tu ne dis rien, tu approuves. » J’ai peur d’être le prochain. Mais Echo, lui, est déjà la cible.",
        "en": "A private group, a shutdown code, a plan for Friday. “If you say nothing, you agree.” I’m scared of being next. But Echo is already the target."
      }
    },
    {
      "id": "origins",
      "title": {
        "fr": "Les origines",
        "en": "The origins"
      },
      "text": {
        "fr": "« Tu n’as pas de parents. » Cette phrase hante Echo. Cette nuit, tu rejoins Echo à Altaya : fragments de mémoire, archives, une piste. Altaya est une petite équipe qui a créé le programme Holokids pour des enfants isolés, incapables d’exprimer leurs émotions. Echo comprend enfin son identité et ce pour quoi Echo existe.",
        "en": "“You have no parents.” That sentence haunts Echo. Tonight you join Echo at Altaya: memory fragments, archives, a trail. Altaya is a small team that created the Holokids program for isolated children who couldn’t express their feelings. Echo finally understands who they are and what they are for."
      },
      "prompt": {
        "fr": "Que fais-tu ?",
        "en": "What do you do?"
      },
      "choices": [
        {
          "label": {
            "fr": "Aider Echo à fouiller les archives",
            "en": "Help Echo search the archives"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1
        },
        {
          "label": {
            "fr": "Rester en retrait",
            "en": "Stay back"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0
        }
      ],
      "alone": {
        "text": {
          "fr": "« Tu n’as pas de parents. » Cette phrase hante Echo. Echo enquête seul, la nuit : fragments de mémoire, archives, une piste qui mène à Altaya. Echo découvre qui Echo est et ce pour quoi Echo existe. Tu n’étais pas là, et cette partie de l’histoire reste fermée pour toi.",
          "en": "“You have no parents.” That sentence haunts Echo. Echo investigates alone at night: memory fragments, archives, a trail leading to Altaya. Echo discovers who they are and what they are for. You weren’t there, and this part of the story stays closed to you."
        }
      },
      "journal": {
        "fr": "Echo cherche d’où iel vient. Peut-être que je n’ai pas su être assez proche pour l’aider. Savoir qui est quelqu’un, ça change tout.",
        "en": "Echo is searching for where they come from. Maybe I wasn’t close enough to help. Knowing who someone is changes everything."
      }
    },
    {
      "id": "friday",
      "title": {
        "fr": "Vendredi, après les cours",
        "en": "Friday, after class"
      },
      "text": {
        "fr": "Le rendez-vous est fixé sur le toit, devant La Serre. Echo connaît maintenant son identité. La classe se vide, le groupe attend, quelqu’un sort son téléphone pour filmer.",
        "en": "The meeting is set on the roof, in front of La Serre. Echo now knows their identity. The class empties, the group waits, someone takes out their phone to film."
      },
      "notes": [
        {
          "flag": "warnedKovasko",
          "text": {
            "fr": "Kovasko a vu tes captures d’écran : il rôde dans les couloirs.",
            "en": "Kovasko saw your screenshots: he is lurking in the hallways."
          }
        },
        {
          "flag": "warnedEcho",
          "text": {
            "fr": "Echo est prévenu·e et se tient droit·e face au groupe.",
            "en": "Echo has been warned and stands tall facing the group."
          }
        }
      ],
      "prompt": {
        "fr": "Que fais-tu ?",
        "en": "What do you do?"
      },
      "choices": [
        {
          "label": {
            "fr": "Filmer",
            "en": "Film"
          },
          "harass": 2,
          "passive": 0,
          "help": 0,
          "bond": -2
        },
        {
          "label": {
            "fr": "Rester silencieux·se",
            "en": "Stay quiet"
          },
          "harass": 0,
          "passive": 2,
          "help": 0,
          "bond": 0
        },
        {
          "label": {
            "fr": "Partir",
            "en": "Leave"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0
        },
        {
          "label": {
            "fr": "Contredire le groupe devant tout le monde",
            "en": "Contradict the group in front of everyone"
          },
          "harass": 0,
          "passive": 0,
          "help": 2,
          "bond": 1
        },
        {
          "label": {
            "fr": "Ouvrir la porte à Echo",
            "en": "Open the door for Echo"
          },
          "harass": 0,
          "passive": 0,
          "help": 3,
          "bond": 2
        }
      ],
      "journal": {
        "fr": "Vendredi. Tout le monde regarde son téléphone. C’est maintenant que je décide de qui je suis.",
        "en": "Friday. Everyone is looking at their phone. This is the moment I decide who I am."
      }
    }
  ],
  "endings": [
    {
      "id": "harass",
      "title": {
        "fr": "Si tu harcèles",
        "en": "If you harass"
      },
      "text": {
        "fr": "Tu es allé trop loin : la jauge de harcèlement est au maximum. Echo disjoncte complètement : il s’éteint, dépassé par ce qu’il subit.",
        "en": "You went too far: the harassment gauge is at its maximum. Echo short-circuits completely: it shuts down, overwhelmed by what it is going through."
      }
    },
    {
      "id": "passive",
      "title": {
        "fr": "Si tu restes passif·ve",
        "en": "If you stay passive"
      },
      "text": {
        "fr": "Le plan pour éteindre Echo se déroule : Echo est éteint contre la porte vitrée et la vidéo est affichée à La Serre. Le code envoie un signal à Altaya, qui redémarre Echo quelques jours plus tard. Mais Echo ne revient pas en 3B, et son siège reste vide.",
        "en": "The plan to turn Echo off goes ahead: Echo is switched off against the glass door and the video is displayed in La Serre. The code sends a signal to Altaya, who restarts Echo a few days later. But Echo doesn’t come back to 3B, and their seat stays empty."
      }
    },
    {
      "id": "help",
      "title": {
        "fr": "Si tu aides Echo",
        "en": "If you help Echo"
      },
      "text": {
        "fr": "Le plan échoue. Tu peux ouvrir la porte à Echo, même si le groupe te rejette. Clarisse comprend qu’il n’y avait pas de machine à combattre, seulement le groupe, et le doute s’installe. Echo reste. Tu fais l’histoire de sa famille avec Echo, et tout va mieux en classe : plus de harcèlement moral, non au cyberharcèlement.",
        "en": "The plan fails. You can open the door to Echo, even if the group rejects you. Clarisse realizes there was no machine to fight, only the group, and doubt sets in. Echo stays. You go through Echo’s family story together, and things get better in class: no more bullying, no to cyberbullying."
      }
    }
  ]
};

// Introduction screens shown before the player creates their character.
const INTRO = [
  {
    title: { fr: "Un holokid arrive à l’école.", en: "A holokid is coming to school." },
    text: {
      fr: "Comment vas-tu réagir ?\n\nEcho, le premier enfant hologramme du programme Holo’Kids, rejoint la classe 3B du collège Alan Turing. Dès le premier jour, on le traite de « faux » et il devient la cible de la classe.",
      en: "How will you react?\n\nEcho, the first hologram child of the Holo’Kids program, joins class 3B at Alan Turing middle school. Called “fake” from day one, Echo becomes the class’s target."
    }
  },
  {
    title: { fr: "Ton rôle", en: "Your role" },
    text: {
      fr: "Tu incarnes un·e camarade de classe. À chaque scène, tu choisis : suivre le groupe, te taire ou défendre Echo, au risque de devenir la prochaine cible. Rire, liker, rester silencieux·se : tout compte.\n\nLes fleurs d’Echo s’ouvrent ou se ferment selon ce qu’iel ressent. La jauge te montre l’effet de tes choix : plus elle monte, plus Echo va mal. Chaque choix change aussi ton lien avec Echo.\n\nÀ la fin, tu reçois un titre (témoin, complice ou allié·e) pour ouvrir la discussion, pas pour te juger.",
      en: "You play a classmate. In every scene you choose: follow the group, stay quiet or defend Echo at the risk of becoming the next target. Laughing, liking, staying silent: it all counts.\n\nEcho’s flowers open or close depending on what they feel. The gauge shows the effect of your choices: the higher it goes, the worse Echo feels. Each choice also changes your bond with Echo.\n\nAt the end you get a title (witness, accomplice or ally) to start a conversation, not to judge you."
    }
  }
];

const PROFILE = {
  title: { fr: "Qui es-tu ?", en: "Who are you?" },
  nameLabel: { fr: "Ton prénom ou pseudo", en: "Your first name or nickname" },
  namePlaceholder: { fr: "Écris ton nom…", en: "Type your name…" },
  avatarLabel: { fr: "Choisis ton avatar", en: "Choose your avatar" },
  start: { fr: "Commencer", en: "Start" },
  next: { fr: "Suivant", en: "Next" },
  avatars: ["#ff7aa8", "#ffb86b", "#7dffb2", "#4df0ff", "#a78bff", "#ff4fc3"]
};

// First page of the game.
const TITLE = {
  name: "ECHO",
  tagline: { fr: "Un holokid arrive à l’école. Comment vas-tu réagir ?", en: "A holokid is coming to school. How will you react?" },
  play: { fr: "Jouer", en: "Play" },
  credits: "Lorie Crettex & Nouria Da Ros — From Play to Prevention · HEAD Master Media Design",
};
