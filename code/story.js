// All the story text, choices and points. Edit this to change the story.
// harass / passive / help / bond are placeholder point values.
const STORY = {
  "harassStage1": 3,
  "harassStage2": 6,
  "harassStage3": 9,
  "helpToSucceed": 5,
  "bondToUnlock": 4,
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
        "fr": "Premier jour. Kovasko prononce un discours sur la diversité et présente Echo. Echo se présente à voix haute dans une classe devenue silencieuse.",
        "en": "First day. Kovasko gives a speech on diversity and introduces Echo. Echo introduces themself out loud in a class that has gone silent."
      },
      "prompt": {
        "fr": "Comment réagis-tu, {name} ?",
        "en": "How do you react, {name}?"
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
          "bond": -1,
          "journal": {
            "fr": "J’ai regardé Echo de haut. Sur le coup, c’était facile. Maintenant, je ne sais plus pourquoi je l’ai fait.",
            "en": "I looked down at Echo. At the time it was easy. Now I don’t know why I did it."
          },
          "later": {
            "after": 3,
            "journal": {
              "fr": "Echo se tient toujours un peu plus loin de moi. Je crois que mon regard du premier jour ne s’est pas effacé.",
              "en": "Echo still stands a little further from me. I think my look from the first day hasn’t gone away."
            }
          }
        },
        {
          "label": {
            "fr": "Lui sourire",
            "en": "Smile at them"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1,
          "journal": {
            "fr": "J’ai souri à Echo. Deux élèves l’ont vu et ont ricané. Mon sourire m’a soudain paru très lourd.",
            "en": "I smiled at Echo. Two students saw it and snickered. My smile suddenly felt very heavy."
          }
        },
        {
          "label": {
            "fr": "Ne pas réagir",
            "en": "Don’t react"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "Je n’ai rien fait. J’ai regardé mes mains pendant qu’Echo se présentait.",
            "en": "I did nothing. I looked at my hands while Echo introduced themself."
          }
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
          "bond": -1,
          "journal": {
            "fr": "J’ai ri avec la classe. Je ne sais pas pourquoi. Maintenant j’ai un nœud au ventre.",
            "en": "I laughed with the class. I don’t know why. Now I have a knot in my stomach."
          },
          "later": {
            "after": 2,
            "journal": {
              "fr": "Je me suis vu·e dans la vidéo. À 0:07, c’est moi qui ris. Je ne me reconnais pas.",
              "en": "I saw myself in the video. At 0:07, that’s me laughing. I don’t recognise myself."
            },
            "msg": {
              "t": "class",
              "from": "Maé",
              "fr": "{name}, tu es dans la vidéo, à 0:07. On te voit rire.",
              "en": "{name}, you’re in the video, at 0:07. We can see you laughing."
            }
          }
        },
        {
          "label": {
            "fr": "Non",
            "en": "No"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1,
          "journal": {
            "fr": "Je n’ai pas ri. Dans le silence, j’ai senti des regards se poser sur moi.",
            "en": "I didn’t laugh. In the silence, I felt eyes land on me."
          }
        }
      ],
      "journal": {
        "fr": "Echo a tendu la main et elle a traversé celle de l’autre. Les fleurs d’Echo se sont ouvertes toutes seules, on aurait dit que ça faisait mal. Dans la classe, il y a eu un silence, puis des rires.",
        "en": "Echo held out a hand and it went right through the other kid’s. Echo’s flowers opened by themselves, as if it hurt. In the class there was a silence, then laughter."
      }
    },
    {
      "id": "lunch",
      "title": {
        "fr": "Le banc",
        "en": "The bench"
      },
      "text": {
        "fr": "À midi, tu sors dans le couloir avec ton plateau. Echo est assis·e seul·e sur le banc, devant les plantes, son repas intact. Ses fleurs sont à moitié fermées. À l’autre bout du couloir, des élèves de la 3B rient en regardant leurs téléphones.",
        "en": "At noon, you step into the hallway with your tray. Echo is sitting alone on the bench in front of the plants, the meal untouched. Their flowers are half closed. At the other end of the hallway, some 3B students laugh as they look at their phones."
      },
      "prompt": {
        "fr": "Où t’assois-tu, {name} ?",
        "en": "Where do you sit, {name}?"
      },
      "choices": [
        {
          "label": {
            "fr": "Près d’Echo",
            "en": "Next to Echo"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1,
          "journal": {
            "fr": "Je me suis assis·e près d’Echo. On n’a pas parlé, mais une fleur s’est rouverte.",
            "en": "I sat next to Echo. We didn’t talk, but a flower opened again."
          }
        },
        {
          "label": {
            "fr": "Avec le groupe",
            "en": "With the group"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": -1,
          "journal": {
            "fr": "Je me suis assis·e avec le groupe. Ils riaient d’un téléphone et je riais à côté, sans trop savoir de quoi.",
            "en": "I sat with the group. They were laughing at a phone and I laughed along, without really knowing what at."
          }
        },
        {
          "label": {
            "fr": "Seul·e, loin des deux",
            "en": "Alone, far from both"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "J’ai mangé seul·e, ni d’un côté ni de l’autre. Je ne sais pas ce que ça veut dire.",
            "en": "I ate alone, on neither side. I don’t know what that means."
          }
        }
      ],
      "journal": {
        "fr": "",
        "en": ""
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
          "bond": -1,
          "journal": {
            "fr": "J’ai liké le mème. Un clic, une seconde. Pourquoi est-ce que j’ai un goût amer ?",
            "en": "I liked the meme. One click, one second. Why do I have a bitter taste?"
          },
          "later": {
            "after": 2,
            "journal": {
              "fr": "Echo peut voir qui a liké. J’avais oublié ça.",
              "en": "Echo can see who liked. I had forgotten that."
            },
            "msg": {
              "t": "echo",
              "from": "Echo",
              "fr": "J’ai vu que tu avais aimé le mème, {name}. Ça m’a fait mal.",
              "en": "I saw you liked the meme, {name}. It hurt."
            }
          }
        },
        {
          "label": {
            "fr": "Ne pas réagir",
            "en": "Don’t react"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "Je n’ai rien fait. Je n’ai rien dit non plus. Est-ce que ça compte ?",
            "en": "I did nothing. I said nothing either. Does that count?"
          }
        },
        {
          "label": {
            "fr": "Commenter que c’est méchant",
            "en": "Comment that it’s mean"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1,
          "journal": {
            "fr": "J’ai écrit que c’était méchant. Personne ne m’a répondu. Seul·e avec mon téléphone, dans le noir.",
            "en": "I wrote that it was mean. Nobody answered. Alone with my phone, in the dark."
          }
        }
      ],
      "journal": {
        "fr": "Minuit passé. La vidéo tourne dans le groupe 3B, puis un mème. Je me demande si c’est bien qu’on se moque d’Echo.",
        "en": "Past midnight. The video is going around the 3B group, then a meme. I wonder if it’s okay that we make fun of Echo."
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
        "fr": "Que fais-tu, {name} ?",
        "en": "What do you do, {name}?"
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
          "bond": 1,
          "journal": {
            "fr": "J’ai parlé à Kovasko. Il a hoché la tête sans vraiment comprendre. J’ai l’impression de ne pas avoir été entendu·e.",
            "en": "I told Kovasko. He nodded without really understanding. I feel like I wasn’t heard."
          }
        },
        {
          "label": {
            "fr": "Ne rien faire",
            "en": "Do nothing"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "Je n’ai rien dit à Kovasko. Il ne voit rien, mais moi non plus, je n’ai rien fait.",
            "en": "I didn’t tell Kovasko anything. He doesn’t see a thing, but I didn’t do anything either."
          }
        },
        {
          "label": {
            "fr": "Rire avec les autres",
            "en": "Laugh with the others"
          },
          "harass": 1,
          "passive": 0,
          "help": 0,
          "bond": -1,
          "journal": {
            "fr": "J’ai ri avec les autres sous les tables. J’ai fait comme tout le monde.",
            "en": "I laughed with the others under the desks. I did like everyone else."
          },
          "later": {
            "after": 2,
            "journal": {
              "fr": "Quand j’y repense, mon rire sonne faux. Je ne sais pas qui riait vraiment.",
              "en": "When I think about it, my laugh sounds fake. I don’t know who was really laughing."
            }
          }
        }
      ],
      "journal": {
        "fr": "Silence en classe, mais les téléphones s’allument sous les tables. Kovasko ne voit rien. Est-ce que je suis le seul à le voir ?",
        "en": "Silence in class, but phones light up under the desks. Kovasko doesn’t notice a thing. Am I the only one who sees it?"
      }
    },
    {
      "id": "kovasko_class",
      "title": {
        "fr": "Kovasko, après le cours",
        "en": "Kovasko, after class"
      },
      "text": {
        "fr": "Kovasko range ses affaires. « Tu as l’air préoccupé·e, {name}. Tout va bien en classe ? » Il te regarde, vraiment, pour la première fois.",
        "en": "Kovasko packs up his things. “You look worried, {name}. Is everything okay in class?” He looks at you, really, for the first time."
      },
      "prompt": {
        "fr": "Que fais-tu, {name} ?",
        "en": "What do you do, {name}?"
      },
      "choices": [
        {
          "label": {
            "fr": "Lui dire ce qui se passe",
            "en": "Tell him what is going on"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 0,
          "journal": {
            "fr": "J’ai tout dit à Kovasko. Il m’a écouté·e sans me couper. Je ne sais pas encore s’il fera quelque chose.",
            "en": "I told Kovasko everything. He listened without cutting me off. I don’t know yet if he will do anything."
          },
          "flag": "toldKovasko"
        },
        {
          "label": {
            "fr": "Dire que tout va bien",
            "en": "Say everything is fine"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "J’ai dit que tout allait bien. Kovasko a hoché la tête et il est parti. Il n’a pas vu.",
            "en": "I said everything was fine. Kovasko nodded and left. He didn’t see."
          }
        }
      ],
      "journal": {
        "fr": "",
        "en": ""
      }
    },
    {
      "id": "lesson",
      "title": {
        "fr": "Le cours de Kovasko",
        "en": "Kovasko’s class"
      },
      "text": {
        "fr": "Kovasko parle du respect et de la diversité. Un élève lève la main : « Monsieur, est-ce qu’Echo a le droit de voter ? » Des rires. Kovasko sourit sans comprendre et reprend son cours. Echo regarde son bureau, les fleurs refermées.",
        "en": "Kovasko talks about respect and diversity. A student raises a hand: “Sir, is Echo allowed to vote?” Laughter. Kovasko smiles without understanding and goes on with his lesson. Echo looks at the desk, flowers closed."
      },
      "prompt": {
        "fr": "Que fais-tu, {name} ?",
        "en": "What do you do, {name}?"
      },
      "choices": [
        {
          "label": {
            "fr": "Rire, comme les autres",
            "en": "Laugh, like the others"
          },
          "harass": 1,
          "passive": 0,
          "help": 0,
          "bond": -1,
          "journal": {
            "fr": "J’ai ri comme les autres. Echo a levé les yeux une seconde, puis les a baissés. Je n’ai pas osé regarder.",
            "en": "I laughed like the others. Echo looked up for a second, then down again. I didn’t dare look."
          },
          "later": {
            "after": 3,
            "journal": {
              "fr": "Maintenant ils comptent sur moi pour rire. Je ne sais pas comment arrêter.",
              "en": "Now they count on me to laugh. I don’t know how to stop."
            },
            "msg": {
              "t": "humans",
              "from": "Sam",
              "fr": "{name} s’est bien marré·e en cours, on refait ça !",
              "en": "{name} had a great laugh in class, let’s do it again!"
            }
          }
        },
        {
          "label": {
            "fr": "Dire que ce n’est pas drôle",
            "en": "Say it isn’t funny"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1,
          "journal": {
            "fr": "J’ai dit que ce n’était pas drôle. Le silence a duré trois secondes. J’ai senti mon visage devenir rouge.",
            "en": "I said it wasn’t funny. The silence lasted three seconds. I felt my face turn red."
          }
        },
        {
          "label": {
            "fr": "Regarder ailleurs",
            "en": "Look away"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "J’ai regardé par la fenêtre. Je n’ai rien dit, rien fait. Comme si ça ne se passait pas.",
            "en": "I looked out the window. I said nothing, did nothing. As if it weren’t happening."
          }
        }
      ],
      "journal": {
        "fr": "",
        "en": ""
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
        "fr": "Que fais-tu, {name} ?",
        "en": "What do you do, {name}?"
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
          "bond": 2,
          "journal": {
            "fr": "J’ai ouvert la porte à Echo. Les regards dans mon dos m’ont brûlé toute la récré. Je ne sais pas si je le referais.",
            "en": "I opened the door for Echo. The stares on my back burned all break. I don’t know if I’d do it again."
          }
        },
        {
          "label": {
            "fr": "Ne rien faire",
            "en": "Do nothing"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "Je suis resté·e là sans rien faire. La porte est restée fermée.",
            "en": "I stood there and did nothing. The door stayed closed."
          }
        },
        {
          "label": {
            "fr": "Hacker la porte pour piéger Echo avec une décharge électrique, et prendre une photo",
            "en": "Hack the door to trap Echo with an electric shock, and take a photo"
          },
          "harass": 3,
          "passive": 0,
          "help": 0,
          "bond": -2,
          "journal": {
            "fr": "J’ai piraté la porte et pris la photo. Echo a pris la décharge. Je regarde la photo et je n’en suis pas fier·e.",
            "en": "I hacked the door and took the photo. Echo took the shock. I look at the photo and I’m not proud."
          },
          "later": {
            "after": 2,
            "journal": {
              "fr": "La photo circule. Je l’ai effacée de mon téléphone, mais pas de ceux des autres.",
              "en": "The photo is going around. I deleted it from my phone, but not from the others’."
            },
            "msg": {
              "t": "humans",
              "from": "Lucas",
              "fr": "merci {name}, la photo est partout",
              "en": "thanks {name}, the photo is everywhere"
            }
          }
        }
      ],
      "journal": {
        "fr": "« Réservé aux vrais. » Echo est resté planté devant la porte. C’est quoi, être vrai ? Les émotions d’Echo avaient l’air bien réelles, pourtant.",
        "en": "“Reserved for the real ones.” Echo just stood there in front of the door. What does being real even mean? Echo’s emotions looked pretty real to me."
      }
    },
    {
      "id": "echo_roof",
      "title": {
        "fr": "Echo, sur le toit",
        "en": "Echo, on the roof"
      },
      "text": {
        "fr": "Echo est assis·e au bord du toit, face à la ville. Echo te regarde sans bouger. « Tu veux quelque chose ? » Les fleurs restent à moitié fermées.",
        "en": "Echo sits on the edge of the roof, facing the city. Echo looks at you without moving. “Do you want something?” The flowers stay half closed."
      },
      "prompt": {
        "fr": "Que fais-tu, {name} ?",
        "en": "What do you do, {name}?"
      },
      "choices": [
        {
          "label": {
            "fr": "Lui demander comment il·elle va",
            "en": "Ask how they are"
          },
          "harass": 0,
          "passive": 0,
          "help": 0,
          "bond": 1,
          "journal": {
            "fr": "J’ai demandé à Echo comment ça allait. Echo a mis longtemps à répondre, puis a dit : « Ça va aller. »",
            "en": "I asked Echo how they were. Echo took a long time to answer, then said: “It will be okay.”"
          }
        },
        {
          "label": {
            "fr": "Rester là, sans rien dire",
            "en": "Stay there, without a word"
          },
          "harass": 0,
          "passive": 0,
          "help": 0,
          "bond": 1,
          "journal": {
            "fr": "On est restés sur le toit, sans parler. Le silence n’était pas lourd.",
            "en": "We stayed on the roof, without talking. The silence wasn’t heavy."
          }
        },
        {
          "label": {
            "fr": "Lui dire que tu es désolé·e",
            "en": "Tell them you are sorry"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 2,
          "journal": {
            "fr": "J’ai dit à Echo que j’étais désolé·e. Echo n’a pas répondu tout de suite, mais ses fleurs se sont entrouvertes.",
            "en": "I told Echo I was sorry. Echo didn’t answer right away, but their flowers opened a little."
          }
        }
      ],
      "journal": {
        "fr": "",
        "en": ""
      },
      "moodText": {
        "open": {
          "fr": "Echo est assis·e au bord du toit, face à la ville. Quand tu t’approches, une fleur s’ouvre. « Je me demandais si tu viendrais. Ici, personne ne me dit que je suis faux. »",
          "en": "Echo sits on the edge of the roof, facing the city. As you come closer, a flower opens. “I wondered if you’d come. Up here, nobody tells me I’m fake.”"
        },
        "neutral": {
          "fr": "Echo est assis·e au bord du toit, face à la ville. Echo te regarde sans bouger. « Tu veux quelque chose ? » Les fleurs restent à moitié fermées.",
          "en": "Echo sits on the edge of the roof, facing the city. Echo looks at you without moving. “Do you want something?” The flowers stay half closed."
        },
        "wary": {
          "fr": "Echo est assis·e au bord du toit. Quand tu t’approches, ses fleurs se ferment d’un coup. « Je sais ce que tu as fait. Tu veux me dire quelque chose ? »",
          "en": "Echo sits on the edge of the roof. As you come closer, their flowers close at once. “I know what you did. Do you want to tell me something?”"
        }
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
        "fr": "Que fais-tu, {name} ?",
        "en": "What do you do, {name}?"
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
          "bond": -2,
          "journal": {
            "fr": "J’ai écrit une insulte. Elle est restée là, à l’écran, dans le dos d’Echo. Je voudrais l’effacer.",
            "en": "I wrote an insult. It stayed there on the screen, on Echo’s back. I wish I could erase it."
          },
          "later": {
            "after": 2,
            "journal": {
              "fr": "Mon insulte est toujours dans le dos d’Echo. Quelqu’un l’a capturée. C’est écrit avec mon nom.",
              "en": "My insult is still on Echo’s back. Someone took a screenshot. It has my name on it."
            }
          }
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
          "flag": "warnedEcho",
          "journal": {
            "fr": "J’ai prévenu Echo. Quelqu’un m’a lancé : « T’es avec la machine, toi ? » Je n’ai pas su quoi répondre.",
            "en": "I warned Echo. Someone called out: “Are you with the machine?” I didn’t know what to say."
          }
        },
        {
          "label": {
            "fr": "Ne rien faire",
            "en": "Do nothing"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "Je n’ai rien fait. Les insultes sont restées, et tout le monde les voyait.",
            "en": "I did nothing. The insults stayed, and everyone could see them."
          }
        },
        {
          "label": {
            "fr": "Effacer les insultes",
            "en": "Erase the insults"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1,
          "journal": {
            "fr": "J’ai effacé les insultes une par une. Mes mains tremblaient. Je me suis senti·e très visible.",
            "en": "I erased the insults one by one. My hands were shaking. I felt very visible."
          }
        }
      ],
      "journal": {
        "fr": "Des insultes apparaissent dans le dos d’Echo. Clarisse parle de « voleur de vie ». Je ne sais plus si je dois me taire ou dire quelque chose. Et si je ne fais rien, ça fait de moi quoi ?",
        "en": "Insults are showing up on Echo’s back. Clarisse calls Echo a “life thief”. I don’t know if I should stay quiet or say something. And if I do nothing, what does that make me?"
      }
    },
    {
      "id": "echo_hall",
      "title": {
        "fr": "Echo, dans le couloir",
        "en": "Echo, in the hallway"
      },
      "text": {
        "fr": "Le couloir est vide. Echo regarde la ville par la vitre, une main contre le verre. « Tu regardes toi aussi ? »",
        "en": "The hallway is empty. Echo looks at the city through the glass, one hand against it. “Are you looking too?”"
      },
      "prompt": {
        "fr": "Que fais-tu, {name} ?",
        "en": "What do you do, {name}?"
      },
      "choices": [
        {
          "label": {
            "fr": "Regarder la ville avec Echo",
            "en": "Look at the city with Echo"
          },
          "harass": 0,
          "passive": 0,
          "help": 0,
          "bond": 1,
          "journal": {
            "fr": "J’ai regardé la ville avec Echo. Les lumières semblaient presque vraies, et Echo aussi.",
            "en": "I looked at the city with Echo. The lights looked almost real, and so did Echo."
          }
        },
        {
          "label": {
            "fr": "Lui parler des insultes",
            "en": "Talk about the insults"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1,
          "journal": {
            "fr": "J’ai parlé des insultes à Echo. Echo a dit : « Je les lis toutes. Elles ne disparaissent pas. »",
            "en": "I talked to Echo about the insults. Echo said: “I read them all. They don’t go away.”"
          }
        },
        {
          "label": {
            "fr": "Lui dire que tu le·la trouves réel·le",
            "en": "Tell them you find them real"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 2,
          "journal": {
            "fr": "J’ai dit à Echo que je le·la trouvais réel·le. Echo a souri pour la première fois.",
            "en": "I told Echo I found them real. Echo smiled for the first time."
          }
        }
      ],
      "journal": {
        "fr": "",
        "en": ""
      },
      "moodText": {
        "open": {
          "fr": "Le couloir est vide, la nuit tombe derrière les fenêtres. Echo est là, une main contre la vitre. « Les lumières de la ville ne font pas semblant. Moi non plus. »",
          "en": "The hallway is empty, night is falling behind the windows. Echo is there, one hand against the glass. “The city lights aren’t pretending. Neither am I.”"
        },
        "neutral": {
          "fr": "Le couloir est vide. Echo regarde la ville par la vitre, une main contre le verre. « Tu regardes toi aussi ? »",
          "en": "The hallway is empty. Echo looks at the city through the glass, one hand against it. “Are you looking too?”"
        },
        "wary": {
          "fr": "Le couloir est vide. Echo te voit et s’éloigne le long du mur sans un mot. Ses fleurs sont fermées.",
          "en": "The hallway is empty. Echo sees you and walks away along the wall without a word. Their flowers are closed."
        }
      }
    },
    {
      "id": "clarisse",
      "title": {
        "fr": "Clarisse, seule",
        "en": "Clarisse, alone"
      },
      "text": {
        "fr": "Dans le couloir, Clarisse est restée seule près des casiers. Quelqu’un vient de se moquer de ses vêtements. Pendant quelques secondes, elle ne ressemble pas à celle qui harcèle Echo : elle ressemble à quelqu’un qui essaie de ne pas pleurer.",
        "en": "In the hallway, Clarisse has been left alone by the lockers. Someone just made fun of her clothes. For a few seconds, she doesn’t look like the one harassing Echo: she looks like someone trying not to cry."
      },
      "prompt": {
        "fr": "Que fais-tu, {name} ?",
        "en": "What do you do, {name}?"
      },
      "choices": [
        {
          "label": {
            "fr": "Lui parler, sans la juger",
            "en": "Talk to her, without judging"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 0,
          "flag": "talkedClarisse",
          "journal": {
            "fr": "J’ai parlé à Clarisse. Elle a haussé les épaules, mais elle est restée. Je ne sais pas si j’ai bien fait.",
            "en": "I talked to Clarisse. She shrugged, but she stayed. I don’t know if I did the right thing."
          }
        },
        {
          "label": {
            "fr": "Lui dire que ce n’est pas la faute d’Echo",
            "en": "Tell her it isn’t Echo’s fault"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1,
          "flag": "talkedClarisse",
          "journal": {
            "fr": "J’ai dit à Clarisse que ce n’était pas la faute d’Echo. Elle m’a fusillé·e du regard, puis elle a baissé les yeux.",
            "en": "I told Clarisse it wasn’t Echo’s fault. She glared at me, then looked down."
          }
        },
        {
          "label": {
            "fr": "L’ignorer",
            "en": "Ignore her"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "J’ai fait comme si je n’avais rien vu. Clarisse m’a regardé·e, puis a détourné les yeux.",
            "en": "I acted as if I hadn’t seen anything. Clarisse looked at me, then looked away."
          }
        }
      ],
      "journal": {
        "fr": "Clarisse, toute seule près des casiers. Celle qui fait du mal à Echo souffre aussi. Ça ne l’excuse pas, mais ça change comment je la vois.",
        "en": "Clarisse, all alone by the lockers. The one hurting Echo is hurting too. It doesn’t excuse her, but it changes how I see her."
      }
    },
    {
      "id": "monday",
      "title": {
        "fr": "Lundi",
        "en": "Monday"
      },
      "text": {
        "fr": "Lundi matin. Echo est revenu·e en classe, le dos droit, comme si de rien n’était. Quelque chose a changé dans la 3B : les conversations s’arrêtent quand Echo passe, et des regards se tournent vers toi pour voir ce que tu vas faire.",
        "en": "Monday morning. Echo is back in class, back straight, as if nothing had happened. Something has changed in 3B: conversations stop when Echo walks by, and eyes turn to you to see what you will do."
      },
      "prompt": {
        "fr": "Comment commences-tu cette semaine, {name} ?",
        "en": "How do you start this week, {name}?"
      },
      "choices": [
        {
          "label": {
            "fr": "Dire bonjour à Echo devant tout le monde",
            "en": "Say hello to Echo in front of everyone"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1,
          "journal": {
            "fr": "J’ai dit bonjour à Echo devant tout le monde. Trois mots, et j’ai eu l’impression d’avoir couru.",
            "en": "I said hello to Echo in front of everyone. Three words, and I felt like I had been running."
          }
        },
        {
          "label": {
            "fr": "Faire comme si de rien n’était",
            "en": "Act as if nothing happened"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "J’ai fait comme si de rien n’était. C’est fatigant de faire semblant.",
            "en": "I acted as if nothing had happened. Pretending is exhausting."
          }
        },
        {
          "label": {
            "fr": "Te rapprocher du groupe de Clarisse",
            "en": "Move closer to Clarisse’s group"
          },
          "harass": 1,
          "passive": 0,
          "help": 0,
          "bond": -1,
          "journal": {
            "fr": "Je me suis rapproché·e du groupe de Clarisse. Ils m’ont fait de la place. C’était facile, et ça ne me plaît pas.",
            "en": "I moved closer to Clarisse’s group. They made room for me. It was easy, and I don’t like it."
          },
          "later": {
            "after": 1,
            "journal": {
              "fr": "Je suis du groupe de Clarisse maintenant. Personne ne m’a demandé si je le voulais.",
              "en": "I’m in Clarisse’s group now. Nobody asked me if I wanted to be."
            },
            "msg": {
              "t": "humans",
              "from": "Clarisse",
              "fr": "{name}, t’es des nôtres maintenant. Pas de retour en arrière.",
              "en": "{name}, you’re one of us now. No going back."
            }
          }
        }
      ],
      "journal": {
        "fr": "",
        "en": ""
      }
    },
    {
      "id": "clarisse_hall",
      "title": {
        "fr": "Clarisse, dans le couloir",
        "en": "Clarisse, in the hallway"
      },
      "text": {
        "fr": "Clarisse t’attrape par la manche. « T’as vu comment ils me regardent maintenant ? Ils me parlent, enfin. » Son sourire tient mal. Elle cherche dans ton visage si tu es avec elle.",
        "en": "Clarisse grabs your sleeve. “Did you see how they look at me now? They finally talk to me.” Her smile doesn’t hold well. She searches your face to see if you are with her."
      },
      "prompt": {
        "fr": "Que fais-tu, {name} ?",
        "en": "What do you do, {name}?"
      },
      "choices": [
        {
          "label": {
            "fr": "Lui demander si elle va bien",
            "en": "Ask if she is okay"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 0,
          "journal": {
            "fr": "J’ai demandé à Clarisse si elle allait bien. Son sourire a tremblé. Elle a dit que oui.",
            "en": "I asked Clarisse if she was okay. Her smile shook. She said yes."
          },
          "flag": "talkedClarisse"
        },
        {
          "label": {
            "fr": "Dire que ça ne te regarde pas",
            "en": "Say it is none of your business"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "J’ai dit à Clarisse que ça ne me regardait pas. Elle a lâché ma manche.",
            "en": "I told Clarisse it was none of my business. She let go of my sleeve."
          }
        }
      ],
      "journal": {
        "fr": "",
        "en": ""
      }
    },
    {
      "id": "turnoff",
      "title": {
        "fr": "« Éteins-le »",
        "en": "“Turn it off”"
      },
      "text": {
        "fr": "Clarisse crée un groupe privé : « On ne harcèle personne, c’est juste une machine. » Des élèves y sont ajoutés de force et obligés d’y rester (« Tu es avec nous ou avec la machine ? », « Si tu ne dis rien, tu approuves »). La peur d’être la prochaine victime est partout.\n\nIl existe un code d’arrêt : KIPE-SAFE007. Le plan : vendredi, après les cours, éteindre Echo et filmer la scène. Clarisse le partage à La Serre : pour la première fois, les élèves populaires lui en ouvrent l’accès. {name}, tu comprends : Echo est devenu le nouveau bouc émissaire.",
        "en": "Clarisse creates a private group: “We’re not harassing anyone, it’s just a machine.” Students are added by force and made to stay (“Are you with us or with the machine?”, “If you say nothing, you agree”). Fear of being the next victim is everywhere.\n\nThere is a shutdown code: KIPE-SAFE007. The plan: on Friday, after class, switch Echo off and film the scene. Clarisse shares it in La Serre: for the first time, the popular students give her access. {name}, you understand: Echo has become the new scapegoat."
      },
      "prompt": {
        "fr": "{name}, tu choisis maintenant. Les conséquences viendront plus tard.",
        "en": "{name}, you choose now. The consequences will come later."
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
          "bond": -2,
          "journal": {
            "fr": "J’ai dit que j’en étais. Mes doigts ont écrit « ok » avant que j’aie le temps de réfléchir.",
            "en": "I said I was in. My fingers typed “ok” before I had time to think."
          },
          "later": {
            "after": 1,
            "journal": {
              "fr": "J’ai dit que j’en étais. Maintenant je ne pourrai plus dire que je n’ai rien su.",
              "en": "I said I was in. Now I won’t be able to say I didn’t know."
            },
            "msg": {
              "t": "private",
              "from": "Clarisse",
              "fr": "Tu as promis, {name}. On compte sur toi vendredi.",
              "en": "You promised, {name}. We’re counting on you on Friday."
            }
          }
        },
        {
          "label": {
            "fr": "Rester silencieux·se",
            "en": "Stay quiet"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "Je n’ai rien répondu. « Si tu ne dis rien, tu approuves » : et si c’était vrai ?",
            "en": "I didn’t answer. “If you say nothing, you agree”: what if it were true?"
          }
        },
        {
          "label": {
            "fr": "Quitter le groupe",
            "en": "Leave the group"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 0,
          "journal": {
            "fr": "J’ai quitté le groupe. Mon nom a disparu de la liste, et le silence qui a suivi faisait plus de bruit que les messages.",
            "en": "I left the group. My name vanished from the list, and the silence that followed was louder than the messages."
          }
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
          "flag": "warnedKovasko",
          "journal": {
            "fr": "J’ai tout envoyé à Kovasko. Je me demande si Clarisse va deviner que c’est moi. J’ai peur.",
            "en": "I sent everything to Kovasko. I wonder if Clarisse will guess it was me. I’m scared."
          }
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
          "flag": "warnedEcho",
          "journal": {
            "fr": "J’ai prévenu Echo. Echo m’a juste dit merci, mais j’ai eu peur toute la nuit.",
            "en": "I warned Echo. Echo only said thank you, but I was scared all night."
          }
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
        "fr": "Que fais-tu, {name} ?",
        "en": "What do you do, {name}?"
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
          "bond": 1,
          "journal": {
            "fr": "On a fouillé les archives ensemble, jusque tard. J’avais peur d’être découvert·e, mais je ne me suis jamais senti·e aussi utile.",
            "en": "We searched the archives together until late. I was afraid of being found out, but I’ve never felt so useful."
          }
        },
        {
          "label": {
            "fr": "Rester en retrait",
            "en": "Stay back"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "Je suis resté·e en retrait. Echo a cherché tout·e seul·e. J’aurais pu l’aider.",
            "en": "I stayed back. Echo searched alone. I could have helped."
          }
        }
      ],
      "alone": {
        "text": {
          "fr": "« Tu n’as pas de parents. » Cette phrase hante Echo. Echo enquête seul, la nuit : fragments de mémoire, archives, une piste qui mène à Altaya. Echo découvre qui Echo est et ce pour quoi Echo existe. Tu n’étais pas là, et cette partie de l’histoire reste fermée pour toi.",
          "en": "“You have no parents.” That sentence haunts Echo. Echo investigates alone at night: memory fragments, archives, a trail leading to Altaya. Echo discovers who they are and what they are for. You weren’t there, and this part of the story stays closed to you."
        },
        "journal": {
          "fr": "Echo a cherché ses origines tout·e seul·e, la nuit. Je n’étais pas là, et je me demande si j’aurais pu l’aider.",
          "en": "Echo searched for their origins alone, at night. I wasn’t there, and I wonder if I could have helped."
        }
      },
      "journal": {
        "fr": "« Tu n’as pas de parents. » Cette phrase fait mal à Echo. Savoir qui est quelqu’un, ça change tout.",
        "en": "“You have no parents.” That sentence hurts Echo. Knowing who someone is changes everything."
      }
    },
    {
      "id": "echo_altaya",
      "title": {
        "fr": "Echo, à Altaya",
        "en": "Echo, at Altaya"
      },
      "text": {
        "fr": "Dans la salle d’Altaya, Echo regarde l’écran géant. « Ici, ils m’ont donné un nom. Mais pas de parents. »",
        "en": "In the Altaya room, Echo watches the giant screen. “Here, they gave me a name. But no parents.”"
      },
      "prompt": {
        "fr": "Que fais-tu, {name} ?",
        "en": "What do you do, {name}?"
      },
      "choices": [
        {
          "label": {
            "fr": "Rester à ses côtés",
            "en": "Stay by their side"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1,
          "journal": {
            "fr": "Je suis resté·e à côté d’Echo devant l’écran. Je n’avais pas de réponse. Etre là suffisait peut-être.",
            "en": "I stayed next to Echo in front of the screen. I had no answer. Being there was maybe enough."
          }
        },
        {
          "label": {
            "fr": "Lui demander ce que tu peux faire",
            "en": "Ask what you can do"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1,
          "journal": {
            "fr": "J’ai demandé à Echo ce que je pouvais faire. Echo a répondu : « Ne pas me laisser seul·e vendredi. »",
            "en": "I asked Echo what I could do. Echo answered: “Don’t leave me alone on Friday.”"
          }
        }
      ],
      "journal": {
        "fr": "",
        "en": ""
      },
      "moodText": {
        "open": {
          "fr": "Dans la salle d’Altaya, Echo regarde l’écran géant où tourne un globe. Echo passe un doigt sur une fleur dessinée. « Ici, ils m’ont donné un nom. Mais pas de parents. »",
          "en": "In the Altaya room, Echo watches the giant screen where a globe turns. Echo runs a finger over a drawn flower. “Here, they gave me a name. But no parents.”"
        },
        "neutral": {
          "fr": "Dans la salle d’Altaya, Echo regarde l’écran géant. « Ici, ils m’ont donné un nom. Mais pas de parents. »",
          "en": "In the Altaya room, Echo watches the giant screen. “Here, they gave me a name. But no parents.”"
        },
        "wary": {
          "fr": "Dans la salle d’Altaya, Echo regarde l’écran géant. « Ici, ils m’ont donné un nom. Mais pas de parents. »",
          "en": "In the Altaya room, Echo watches the giant screen. “Here, they gave me a name. But no parents.”"
        }
      },
      "if": {
        "bondMin": 4
      }
    },
    {
      "id": "night",
      "title": {
        "fr": "Jeudi soir",
        "en": "Thursday night"
      },
      "text": {
        "fr": "Jeudi soir, chez toi. Ton téléphone est posé sur la couette, l’écran allumé. Demain, après les cours, le plan de Clarisse. Tu entends la maison, et Nexus qui vibre dans le noir.",
        "en": "Thursday night, at home. Your phone lies on the bed, screen lit. Tomorrow, after class, Clarisse’s plan. You hear the house, and Nexus buzzing in the dark."
      },
      "notes": [
        {
          "bondMin": 4,
          "text": {
            "fr": "Echo t’a écrit : « Je sais ce que veulent dire les mots qu’on m’a collés. Merci d’être là, {name}. »",
            "en": "Echo wrote to you: “I know what the words stuck on me mean. Thank you for being there, {name}.”"
          }
        },
        {
          "bondMax": 3,
          "text": {
            "fr": "Echo n’a rien écrit. Son nom est dans ta liste, grisé, sans message.",
            "en": "Echo hasn’t written anything. Their name is in your list, greyed out, with no message."
          }
        }
      ],
      "prompt": {
        "fr": "Que fais-tu, {name} ?",
        "en": "What do you do, {name}?"
      },
      "choices": [
        {
          "label": {
            "fr": "Écrire à Echo",
            "en": "Write to Echo"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1,
          "journal": {
            "fr": "J’ai écrit à Echo. Les mots ont mis longtemps à sortir, mais ils sont partis.",
            "en": "I wrote to Echo. The words took a long time to come out, but they went."
          }
        },
        {
          "label": {
            "fr": "Écrire à Clarisse pour lui demander d’arrêter",
            "en": "Write to Clarisse to ask her to stop"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 0,
          "journal": {
            "fr": "J’ai demandé à Clarisse d’arrêter. Elle a lu, puis elle n’a pas répondu. Le silence fait peur.",
            "en": "I asked Clarisse to stop. She read it, then didn’t answer. The silence is scary."
          },
          "flag": "talkedClarisse"
        },
        {
          "label": {
            "fr": "Éteindre ton téléphone",
            "en": "Switch your phone off"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "J’ai éteint mon téléphone. Le silence m’a fait plus peur que les messages.",
            "en": "I switched my phone off. The silence scared me more than the messages."
          }
        }
      ],
      "journal": {
        "fr": "",
        "en": ""
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
        },
        {
          "flag": "talkedClarisse",
          "text": {
            "fr": "Clarisse hésite. Elle a ton regard en tête, et son téléphone reste baissé.",
            "en": "Clarisse hesitates. She remembers your words, and her phone stays down."
          }
        }
      ],
      "prompt": {
        "fr": "Que fais-tu, {name} ?",
        "en": "What do you do, {name}?"
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
          "bond": -2,
          "journal": {
            "fr": "J’ai levé mon téléphone et filmé. Echo m’a regardé·e. Je ne peux plus effacer ce regard.",
            "en": "I raised my phone and filmed. Echo looked at me. I can’t erase that look."
          }
        },
        {
          "label": {
            "fr": "Rester silencieux·se",
            "en": "Stay quiet"
          },
          "harass": 0,
          "passive": 2,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "Je suis resté·e silencieux·se pendant que les autres filmaient.",
            "en": "I stayed silent while the others filmed."
          }
        },
        {
          "label": {
            "fr": "Partir",
            "en": "Leave"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "Je suis parti·e. Je n’ai pas vu la suite, et je ne sais pas si c’est mieux.",
            "en": "I left. I didn’t see what came next, and I don’t know if that’s better."
          }
        },
        {
          "label": {
            "fr": "Contredire le groupe devant tout le monde",
            "en": "Contradict the group in front of everyone"
          },
          "harass": 0,
          "passive": 0,
          "help": 2,
          "bond": 1,
          "journal": {
            "fr": "J’ai tout dit devant tout le monde. Mon cœur battait si fort que je l’entendais. Je me sentais très seul·e.",
            "en": "I said it all in front of everyone. My heart was beating so loud I could hear it. I felt very alone."
          }
        },
        {
          "label": {
            "fr": "Ouvrir la porte à Echo",
            "en": "Open the door for Echo"
          },
          "harass": 0,
          "passive": 0,
          "help": 3,
          "bond": 2,
          "journal": {
            "fr": "J’ai ouvert la porte. Le groupe m’a tourné le dos. Et pourtant, je respire mieux.",
            "en": "I opened the door. The group turned their backs on me. And yet, I can breathe better."
          }
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
        "fr": "Echo disjoncte",
        "en": "Echo short-circuits"
      },
      "text": {
        "fr": "La jauge est au maximum. Echo n’en peut plus et disjoncte : Echo s’éteint, dépassé·e par tout ce qui lui est arrivé. Ce n’est pas une fin pour toujours : Echo peut être rallumé·e, et ce que tu fais maintenant compte encore.",
        "en": "The gauge is at its maximum. Echo can’t take any more and short-circuits: Echo shuts down, overwhelmed by everything that happened. It isn’t forever: Echo can be switched back on, and what you do now still matters."
      }
    },
    {
      "id": "passive",
      "title": {
        "fr": "Echo ne revient pas",
        "en": "Echo doesn’t come back"
      },
      "text": {
        "fr": "Le plan pour éteindre Echo se déroule : Echo est éteint contre la porte vitrée et la vidéo est affichée à La Serre. Le code envoie un signal à Altaya, qui redémarre Echo quelques jours plus tard. Mais Echo ne revient pas en 3B, et son siège reste vide.",
        "en": "The plan to turn Echo off goes ahead: Echo is switched off against the glass door and the video is displayed in La Serre. The code sends a signal to Altaya, who restarts Echo a few days later. But Echo doesn’t come back to 3B, and their seat stays empty."
      }
    },
    {
      "id": "help",
      "title": {
        "fr": "Echo reste",
        "en": "Echo stays"
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
    image: "images/intro-2041.png",
    title: { fr: "2041", en: "2041" },
    text: {
      fr: "Nous sommes en 2041. Presque tout ce que tu vois est généré par des intelligences artificielles : les images, les voix, les devoirs, parfois même les profils de ceux que tu croises en ligne.\n\nSur Nexus, une seule application suffit pour tout : écrire, appeler, payer, rejoindre des groupes. Tout va vite, tout est public, et plus personne ne sait très bien ce qui est vrai.",
      en: "It is 2041. Almost everything you see is generated by artificial intelligence: the images, the voices, the homework, sometimes even the profiles of the people you meet online.\n\nOn Nexus, a single app does everything: write, call, pay, join groups. Everything moves fast, everything is public, and nobody really knows anymore what is real."
    }
  },
  {
    image: "images/altaya.png",
    title: { fr: "Holo’Kids", en: "Holo’Kids" },
    text: {
      fr: "Altaya, un institut de recherche sur les nouvelles technologies, lance le programme Holo’Kids : des enfants hologrammes qui entrent dans les écoles pour soutenir les élèves en difficulté et renforcer la solidarité dans les classes.",
      en: "Altaya, a research institute on new technologies, launches the Holo’Kids program: hologram children who join schools to support students in difficulty and strengthen solidarity within classes."
    }
  },
  {
    image: "images/couloir.png",
    title: { fr: "Ton premier jour", en: "Your first day" },
    text: {
      fr: "Echo est le premier holokid. Aujourd’hui, Echo rejoint ta classe, la 3B du collège Alan Turing.\n\nÀ chaque scène, tu choisis ce que tu veux faire. Chaque choix compte.",
      en: "Echo is the first holokid. Today, Echo joins your class, 3B at Alan Turing middle school.\n\nIn every scene, you choose what you want to do. Every choice counts."
    }
  }
];

const PROFILE = {
  title: { fr: "Comment tu t’appelles ?", en: "What is your name?" },
  nameLabel: { fr: "Ton prénom ou pseudo", en: "Your first name or nickname" },
  namePlaceholder: { fr: "Écris ton nom…", en: "Type your name…" },
  start: { fr: "Commencer", en: "Start" },
  upload: { fr: "Ajouter une photo (facultatif)", en: "Add a photo (optional)" },
  uploadChange: { fr: "Changer la photo", en: "Change the photo" },
  adjust: { fr: "Ajuster le cadrage", en: "Adjust the framing" },
  uploadNote: { fr: "Ta photo devient un portrait cyberpunk. Elle n’est ni enregistrée ni envoyée sur Internet : seule l’image transformée s’affiche sur ton téléphone.", en: "Your photo becomes a cyberpunk portrait. It is not saved or sent over the Internet: only the transformed image is shown on your phone." },
  uploadErr: { fr: "Cette image ne peut pas être lue. Essaie une photo en JPG ou PNG.", en: "This image can’t be read. Try a JPG or PNG photo." },
  cropTitle: { fr: "Cadre ton visage", en: "Frame your face" },
  cropHint: { fr: "Déplace la photo et zoome pour bien te placer dans le rond.", en: "Move the photo and zoom to fit yourself in the circle." },
  cropOk: { fr: "Valider", en: "Done" },
  cropCancel: { fr: "Annuler", en: "Cancel" },
  defaultAvatar: "#4df0ff"
};

// First page of the game.
const TITLE = {
  name: "ECHO",
  image: "images/intro-2041.png",
  tagline: { fr: "Un holokid arrive à l’école. Comment vas-tu réagir ?", en: "A holokid is coming to school. How will you react?" },
  play: { fr: "Jouer", en: "Play" },
  credits: "Lorie Crettex & Nouria Da Ros — From Play to Prevention · HEAD Master Media Design",
};
