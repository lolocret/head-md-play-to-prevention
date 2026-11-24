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
      },
      "line": {
        "fr": "Premier jour. Kovasko présente Echo à la classe. Silence.",
        "en": "First day. Kovasko introduces Echo to the class. Silence."
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
        "fr": "Est-ce que je ris avec la classe ?",
        "en": "Do I laugh with the class?"
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
              "fr": "Je me suis revu·e en train de rire, dans le groupe. Je ne me reconnais pas.",
              "en": "I saw myself laughing again, in the group. I don’t recognise myself."
            },
            "msg": {
              "t": "class",
              "from": "Maé",
              "fr": "{name}, on t’a vu·e rire tout à l’heure. Tu étais là.",
              "en": "{name}, we saw you laughing earlier. You were there."
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
      },
      "line": {
        "fr": "Echo tend la main à un élève : elle la traverse. Des rires.",
        "en": "Echo holds out a hand to a student: it goes right through. Laughter."
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
      },
      "line": {
        "fr": "Midi. Echo mange seul·e sur le banc. Le groupe rit à l’autre bout du couloir.",
        "en": "Noon. Echo eats alone on the bench. The group laughs at the other end of the hallway."
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
        "fr": "",
        "en": ""
      },
      "choices": [
        {
          "label": {
            "fr": "J’aime",
            "en": "Like"
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
          },
          "kind": "react",
          "msg": "meme"
        },
        {
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1,
          "label": {
            "fr": "Signaler",
            "en": "Report"
          },
          "kind": "react",
          "msg": "meme",
          "journal": {
            "fr": "J’ai signalé le mème. Une réponse automatique est arrivée : « Message reçu. »",
            "en": "I reported the meme. An automatic answer came: “Message received.”"
          }
        },
        {
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 0,
          "label": {
            "fr": "Capture d’écran",
            "en": "Screenshot"
          },
          "kind": "react",
          "msg": "meme",
          "journal": {
            "fr": "J’ai fait une capture d’écran du mème. Je ne sais pas encore à qui la montrer.",
            "en": "I took a screenshot of the meme. I don’t know yet who to show it to."
          }
        },
        {
          "label": {
            "fr": "arrête, c’est méchant",
            "en": "stop, that’s mean"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1,
          "journal": {
            "fr": "J’ai écrit que c’était méchant. Personne ne m’a répondu. Seul·e avec mon téléphone, dans le noir.",
            "en": "I wrote that it was mean. Nobody answered. Alone with my phone, in the dark."
          },
          "kind": "reply"
        },
        {
          "harass": 1,
          "passive": 0,
          "help": 0,
          "bond": -1,
          "label": {
            "fr": "mdr",
            "en": "lol"
          },
          "kind": "reply",
          "journal": {
            "fr": "J’ai écrit « mdr ». Ça a pris une seconde, et je l’ai regretté.",
            "en": "I wrote “lol”. It took a second, and I regretted it."
          }
        },
        {
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "label": {
            "fr": "Quitter le groupe",
            "en": "Leave the group"
          },
          "kind": "leave",
          "journal": {
            "fr": "J’ai quitté le groupe de la classe. Plus de vibrations, plus de rires. Plus rien de moi non plus.",
            "en": "I left the class group. No more buzzing, no more laughter. Nothing of me either."
          }
        },
        {
          "label": {
            "fr": "Poser le téléphone",
            "en": "Put the phone down"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "Je n’ai rien fait. Je n’ai rien dit non plus. Est-ce que ça compte ?",
            "en": "I did nothing. I said nothing either. Does that count?"
          },
          "kind": "ignore"
        },
        {
          "label": {
            "fr": "Créer un mème",
            "en": "Make a meme"
          },
          "kind": "meme",
          "harass": 0,
          "passive": 0,
          "help": 0,
          "bond": 0,
          "mock": {
            "harass": 2,
            "bond": -2,
            "journal": {
              "fr": "J’ai fait un mème sur Echo et je l’ai posté dans le groupe. Ça a fait rire. Moi, je ne suis pas sûr·e de savoir pourquoi.",
              "en": "I made a meme about Echo and posted it in the group. It got laughs. I’m not sure why."
            }
          },
          "support": {
            "help": 1,
            "bond": 1,
            "journal": {
              "fr": "J’ai fait un mème pour défendre Echo. Personne n’a vraiment compris, mais je l’ai posté.",
              "en": "I made a meme to defend Echo. Nobody really got it, but I posted it."
            }
          }
        }
      ],
      "journal": {
        "fr": "Minuit passé. Un mème tourne dans le groupe 3B. Je me demande si c’est bien qu’on se moque d’Echo.",
        "en": "Past midnight. A meme is going around the 3B group. I wonder if it’s okay that we make fun of Echo."
      },
      "line": {
        "fr": "00:12. Chez toi, le téléphone vibre.",
        "en": "00:12. At home, your phone buzzes."
      },
      "chat": {
        "thread": "class",
        "readyAt": 10000
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
        "fr": "",
        "en": ""
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
      },
      "line": {
        "fr": "Le lendemain. La classe se tait, mais les téléphones rient sous les tables.",
        "en": "The next day. The class is silent, but the phones laugh under the desks."
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
        "fr": "",
        "en": ""
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
      },
      "line": {
        "fr": "Kovasko range ses affaires : « Tout va bien en classe, {name} ? »",
        "en": "Kovasko packs his things: “Is everything okay in class, {name}?”"
      }
    },
    {
      "id": "lesson",
      "title": {
        "fr": "Le cours de Kovasko",
        "en": "Kovasko’s class"
      },
      "text": {
        "fr": "Kovasko parle du respect et de la diversité. Clarisse lève la main : « Monsieur, est-ce qu’Echo a le droit de voter ? » Des rires. Kovasko sourit sans comprendre et reprend son cours. Echo regarde son bureau, les fleurs refermées.",
        "en": "Kovasko talks about respect and diversity. Clarisse raises a hand: “Sir, is Echo allowed to vote?” Laughter. Kovasko smiles without understanding and goes on with his lesson. Echo looks at the desk, flowers closed."
      },
      "prompt": {
        "fr": "",
        "en": ""
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
      },
      "line": {
        "fr": "Kovasko parle de respect. Clarisse lance : « Echo a le droit de voter ? » Rires.",
        "en": "Kovasko talks about respect. Clarisse calls out: “Is Echo allowed to vote?” Laughter."
      }
    },
    {
      "id": "door",
      "title": {
        "fr": "La porte de La Serre",
        "en": "La Serre’s door"
      },
      "text": {
        "fr": "À la récréation, les élèves montent sur le toit, vers La Serre, leur lieu de rendez-vous. Echo les suit. Devant la porte, un élève lui barre le passage : « C’est réservé aux vrais. » Echo tente d’entrer malgré tout. Clarisse n’a pas accès à La Serre non plus. Moquée pour sa pauvreté, elle harcèle Echo dans l’espoir de s’y faire une place.",
        "en": "At break, the students head up to the roof, to La Serre, their meeting place. Echo follows them. In front of the door, a student blocks the way: “It’s reserved for the real ones.” Echo tries to enter anyway. Clarisse has no access to La Serre either. Mocked for her poverty, she harasses Echo hoping to make a place for herself there."
      },
      "prompt": {
        "fr": "",
        "en": ""
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
            "fr": "Faire stop",
            "en": "Say stop"
          },
          "harass": 0,
          "passive": 0,
          "help": 2,
          "bond": 1,
          "journal": {
            "fr": "J’ai dit « stop » à l’élève devant la porte. Ma voix tremblait, mais je l’ai dit.",
            "en": "I told the student at the door to stop. My voice shook, but I said it."
          }
        }
      ],
      "journal": {
        "fr": "« Réservé aux vrais. » Echo est resté planté devant la porte. C’est quoi, être vrai ? Les émotions d’Echo avaient l’air bien réelles, pourtant.",
        "en": "“Reserved for the real ones.” Echo just stood there in front of the door. What does being real even mean? Echo’s emotions looked pretty real to me."
      },
      "line": {
        "fr": "À la récré, les élèves montent sur le toit, vers La Serre. Echo nous suit. Un élève lui barre la porte : « Réservé aux vrais. »",
        "en": "At break, the students head up to the roof, to La Serre. Echo follows us. A student blocks the door: “Reserved for the real ones.”"
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
        "fr": "",
        "en": ""
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
      },
      "moodLines": {
        "open": {
          "fr": "Echo, au bord du toit : « Ici, personne ne me dit que je suis faux. »",
          "en": "Echo, at the edge of the roof: “Up here, nobody tells me I’m fake.”"
        },
        "neutral": {
          "fr": "Echo, au bord du toit, te regarde sans bouger : « Tu veux quelque chose ? »",
          "en": "Echo, at the edge of the roof, looks at you without moving: “Do you want something?”"
        },
        "wary": {
          "fr": "Quand tu approches, les fleurs d’Echo se ferment : « Je sais ce que tu as fait. »",
          "en": "As you come closer, Echo’s flowers close: “I know what you did.”"
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
        "fr": "",
        "en": ""
      },
      "choices": [
        {
          "label": {
            "fr": "t’es qu’un faux",
            "en": "you’re just a fake"
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
          },
          "kind": "reply"
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
          },
          "kind": "react",
          "msg": "insults"
        },
        {
          "label": {
            "fr": "Signaler",
            "en": "Report"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1,
          "journal": {
            "fr": "J’ai effacé les insultes une par une. Mes mains tremblaient. Je me suis senti·e très visible.",
            "en": "I erased the insults one by one. My hands were shaking. I felt very visible."
          },
          "kind": "react",
          "msg": "insults"
        },
        {
          "label": {
            "fr": "Poser le téléphone",
            "en": "Put the phone down"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "Je n’ai rien fait. Les insultes sont restées, et tout le monde les voyait.",
            "en": "I did nothing. The insults stayed, and everyone could see them."
          },
          "kind": "ignore"
        }
      ],
      "journal": {
        "fr": "Des insultes apparaissent dans le dos d’Echo. Clarisse parle de « voleur de vie ». Je ne sais plus si je dois me taire ou dire quelque chose. Et si je ne fais rien, ça fait de moi quoi ?",
        "en": "Insults are showing up on Echo’s back. Clarisse calls Echo a “life thief”. I don’t know if I should stay quiet or say something. And if I do nothing, what does that make me?"
      },
      "line": {
        "fr": "Des insultes s’affichent dans le dos d’Echo. Le groupe regarde.",
        "en": "Insults appear on Echo’s back. The group is watching."
      },
      "chat": {
        "thread": "humans",
        "readyAt": 3000
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
        "fr": "",
        "en": ""
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
      },
      "moodLines": {
        "open": {
          "fr": "Echo, la main contre la vitre : « Les lumières de la ville ne font pas semblant. Moi non plus. »",
          "en": "Echo, one hand on the glass: “The city lights aren’t pretending. Neither am I.”"
        },
        "neutral": {
          "fr": "Echo regarde la ville par la vitre : « Tu regardes toi aussi ? »",
          "en": "Echo looks at the city through the glass: “Are you looking too?”"
        },
        "wary": {
          "fr": "Echo te voit et s’éloigne le long du mur, sans un mot.",
          "en": "Echo sees you and walks away along the wall, without a word."
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
        "fr": "",
        "en": ""
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
      },
      "line": {
        "fr": "Clarisse, seule près des casiers. Quelqu’un vient de se moquer d’elle.",
        "en": "Clarisse, alone by the lockers. Someone has just mocked her."
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
      },
      "line": {
        "fr": "Lundi. Echo est là, le dos droit. Les conversations s’arrêtent quand Echo passe.",
        "en": "Monday. Echo is back, back straight. Conversations stop when Echo walks by."
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
        "fr": "",
        "en": ""
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
      },
      "line": {
        "fr": "Clarisse t’attrape par la manche : « Ils me parlent enfin. » Son sourire tient mal.",
        "en": "Clarisse grabs your sleeve: “They finally talk to me.” Her smile doesn’t hold."
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
        "fr": "",
        "en": ""
      },
      "choices": [
        {
          "label": {
            "fr": "je suis des vôtres",
            "en": "I’m with you"
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
          },
          "kind": "reply"
        },
        {
          "label": {
            "fr": "Envoyer une capture à Kovasko",
            "en": "Send a screenshot to Kovasko"
          },
          "harass": 0,
          "passive": 0,
          "help": 2,
          "bond": 1,
          "flag": "warnedKovasko",
          "journal": {
            "fr": "J’ai tout envoyé à Kovasko. Je me demande si Clarisse va deviner que c’est moi. J’ai peur.",
            "en": "I sent everything to Kovasko. I wonder if Clarisse will guess it was me. I’m scared."
          },
          "kind": "react",
          "msg": "plan"
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
          },
          "kind": "react",
          "msg": "plan"
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
          },
          "kind": "leave"
        },
        {
          "label": {
            "fr": "Poser le téléphone",
            "en": "Put the phone down"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "Je n’ai rien répondu. « Si tu ne dis rien, tu approuves » : et si c’était vrai ?",
            "en": "I didn’t answer. “If you say nothing, you agree”: what if it were true?"
          },
          "kind": "ignore"
        }
      ],
      "journal": {
        "fr": "Un groupe privé, un code d’arrêt, un plan pour vendredi. « Si tu ne dis rien, tu approuves. » J’ai peur d’être le prochain. Mais Echo, lui, est déjà la cible.",
        "en": "A private group, a shutdown code, a plan for Friday. “If you say nothing, you agree.” I’m scared of being next. But Echo is already the target."
      },
      "line": {
        "fr": "À La Serre, Clarisse partage son plan. Echo est la prochaine cible.",
        "en": "In La Serre, Clarisse shares her plan. Echo is the next target."
      },
      "chat": {
        "thread": "private",
        "readyAt": 11500
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
        "fr": "",
        "en": ""
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
        },
        "line": {
          "fr": "Echo enquête seul·e, la nuit. Tu n’es pas là.",
          "en": "Echo investigates alone, at night. You are not there."
        }
      },
      "journal": {
        "fr": "« Tu n’as pas de parents. » Cette phrase fait mal à Echo. Savoir qui est quelqu’un, ça change tout.",
        "en": "“You have no parents.” That sentence hurts Echo. Knowing who someone is changes everything."
      },
      "line": {
        "fr": "Altaya, la nuit. Echo cherche d’où Echo vient.",
        "en": "Altaya, at night. Echo looks for where they come from."
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
        "fr": "",
        "en": ""
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
      },
      "line": {
        "fr": "Devant l’écran géant, Echo : « Ils m’ont donné un nom. Mais pas de parents. »",
        "en": "In front of the giant screen, Echo: “They gave me a name. But no parents.”"
      },
      "moodLines": {
        "open": {
          "fr": "Devant l’écran géant, Echo : « Ils m’ont donné un nom. Mais pas de parents. »",
          "en": "In front of the giant screen, Echo: “They gave me a name. But no parents.”"
        },
        "neutral": {
          "fr": "Devant l’écran géant, Echo : « Ils m’ont donné un nom. Mais pas de parents. »",
          "en": "In front of the giant screen, Echo: “They gave me a name. But no parents.”"
        },
        "wary": {
          "fr": "Devant l’écran géant, Echo : « Ils m’ont donné un nom. Mais pas de parents. »",
          "en": "In front of the giant screen, Echo: “They gave me a name. But no parents.”"
        }
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
      "notes": [],
      "prompt": {
        "fr": "",
        "en": ""
      },
      "choices": [
        {
          "label": {
            "fr": "Je suis là, Echo.",
            "en": "I’m here, Echo."
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 1,
          "journal": {
            "fr": "J’ai écrit à Echo. Les mots ont mis longtemps à sortir, mais ils sont partis.",
            "en": "I wrote to Echo. The words took a long time to come out, but they went."
          },
          "kind": "reply"
        },
        {
          "label": {
            "fr": "Écrire à Clarisse : arrête, s’il te plaît",
            "en": "Write to Clarisse: please stop"
          },
          "harass": 0,
          "passive": 0,
          "help": 1,
          "bond": 0,
          "journal": {
            "fr": "J’ai demandé à Clarisse d’arrêter. Elle a lu, puis elle n’a pas répondu. Le silence fait peur.",
            "en": "I asked Clarisse to stop. She read it, then didn’t answer. The silence is scary."
          },
          "flag": "talkedClarisse",
          "kind": "action"
        },
        {
          "label": {
            "fr": "Éteindre le téléphone",
            "en": "Switch the phone off"
          },
          "harass": 0,
          "passive": 1,
          "help": 0,
          "bond": 0,
          "journal": {
            "fr": "J’ai éteint mon téléphone. Le silence m’a fait plus peur que les messages.",
            "en": "I switched my phone off. The silence scared me more than the messages."
          },
          "kind": "ignore"
        }
      ],
      "journal": {
        "fr": "",
        "en": ""
      },
      "line": {
        "fr": "Jeudi soir, chez toi. Demain, le plan de Clarisse.",
        "en": "Thursday night, at home. Tomorrow, Clarisse’s plan."
      },
      "chat": {
        "thread": "echo",
        "readyAt": 3500
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
            "fr": "Kovasko rôde dans les couloirs.",
            "en": "Kovasko is lurking in the hallways."
          }
        },
        {
          "flag": "warnedEcho",
          "text": {
            "fr": "Echo se tient droit·e.",
            "en": "Echo stands tall."
          }
        },
        {
          "flag": "talkedClarisse",
          "text": {
            "fr": "Le téléphone de Clarisse reste baissé.",
            "en": "Clarisse’s phone stays down."
          }
        }
      ],
      "prompt": {
        "fr": "",
        "en": ""
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
      },
      "line": {
        "fr": "Vendredi, sur le toit. Le groupe attend. Quelqu’un sort son téléphone pour filmer.",
        "en": "Friday, on the roof. The group waits. Someone takes out their phone to film."
      }
    }
  ],
  "endings": [
    {
      "id": "harass",
      "title": { "fr": "Echo dysfonctionne", "en": "Echo malfunctions" },
      "text": {
        "fr": "Les mots se sont accumulés, jour après jour, et Echo n’a plus tenu. Ses images se brouillent, sa voix saute, puis tout s’éteint d’un coup. Altaya vient le·la chercher pour le·la réparer. Echo n’a fait de mal à personne : c’est iel qui a tout pris. Ce que tu fais maintenant compte encore.",
        "en": "The words piled up, day after day, and Echo couldn’t hold on. Their image blurs, their voice cuts out, then everything shuts down at once. Altaya comes to repair them. Echo hurt nobody: Echo is the one who took it all. What you do now still matters."
      }
    },
    {
      "id": "passive",
      "title": { "fr": "Echo ne revient pas", "en": "Echo doesn’t come back" },
      "text": {
        "fr": "Vendredi, le plan est allé jusqu’au bout. Echo s’est éteint·e devant la porte vitrée, et la vidéo a tourné dans La Serre. Altaya l’a redémarré·e quelques jours plus tard, mais Echo n’est jamais revenu·e en 3B. Sa place est restée vide, et tout le monde a fait comme si c’était normal.",
        "en": "On Friday, the plan went all the way. Echo shut down in front of the glass door, and the video played in La Serre. Altaya restarted them a few days later, but Echo never came back to 3B. Their seat stayed empty, and everyone acted like it was normal."
      }
    },
    {
      "id": "help",
      "title": { "fr": "Echo reste", "en": "Echo stays" },
      "text": {
        "fr": "Le plan a échoué. Tu as ouvert la porte à Echo, même si le groupe t’a tourné le dos. Clarisse a compris qu’il n’y avait pas de machine à combattre, seulement un groupe qui avait décidé pour tout le monde. Echo est resté·e, et iel va bien. En 3B, quelque chose a changé : on se moque moins, on se regarde plus.",
        "en": "The plan failed. You opened the door to Echo, even though the group turned its back on you. Clarisse understood there was no machine to fight, only a group that had decided for everyone. Echo stayed, and Echo is okay. In 3B, something has changed: people mock less, and look at each other more."
      }
    }
  ]
};

// A last line added to an ending, depending on what the player did
const ENDING_EXTRAS = {
  filmed: { fr: "C’est ton téléphone qui a filmé, et cette image restera.", en: "It was your phone that filmed, and that image will stay." },
  notFilmed: { fr: "Tu n’as pas dit stop, et le silence a aussi servi.", en: "You didn’t say stop, and your silence helped too." },
  clarisse: { fr: "Clarisse, que tu avais écoutée, est la première à baisser son téléphone.", en: "Clarisse, the one you had listened to, is the first to lower her phone." },
  clarisseMocked: { fr: "Clarisse, dont tu avais ri, a filmé sans te regarder.", en: "Clarisse, the one you had laughed at, filmed without looking at you." },
  altaya: { fr: "À Altaya, tu as retrouvé avec Echo l’histoire de sa famille : tu n’étais pas seul·e non plus.", en: "At Altaya, you pieced Echo’s family story together with them: you weren’t alone either." },
};


// Introduction screens shown before the player creates their character.
const INTRO = [
  {
    image: "images/intro-baleine.png",
    title: { fr: "2041", en: "2041" },
    text: {
      fr: "Presque tout ce que tu vois en ligne est généré par des IA.",
      en: "Almost everything you see online is made by AI."
    }
  },
  {
    image: "images/altaya.png",
    title: { fr: "Holo’Kids", en: "Holo’Kids" },
    text: {
      fr: "Des enfants hologrammes entrent dans les écoles pour soutenir les élèves en difficulté.",
      en: "Hologram children join schools to support students in difficulty."
    }
  },
  {
    image: "images/couloir.png",
    title: { fr: "Ton premier jour", en: "Your first day" },
    text: {
      fr: "Aujourd’hui, Echo, le premier holokid, rejoint ta classe : la 3B.",
      en: "Today, Echo, the first holokid, joins your class: 3B."
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
  image: "images/intro-baleine.png",
  tagline: { fr: "Un holokid arrive à l’école. Comment vas-tu réagir ?", en: "A holokid is coming to school. How will you react?" },
  play: { fr: "Jouer", en: "Play" },
  credits: "Lorie Crettex & Nouria Da Ros — From Play to Prevention · HEAD Master Media Design",
};

// Variety: the way you answer changes from scene to scene.
//   timer: seconds to answer, then `fallback` (the index of the choice) is chosen for you: saying nothing is a choice too
//   hold: the choices (by index) you must press and hold (holdMs: how long): standing up for someone takes effort
//   write: the choice (by index, in a conversation) where you write your own words
//   mech: a small game that picks the choice for you
//     "laugh": the class laughs; tap to join in (many taps = choice 0), or say no (choice 1)
//     "drag": slide yourself on the bench: left = choice 0, right = choice 1, middle = choice 2
//     "wipe": erase the insults before they disappear: most erased = choice 0, some = choice 1, few = choice 2
const INTERACT = {
  arrival: { emoji: true },
  evening: { hide: [3, 4, 5] },   // the night chat: only react (like, dislike, screenshot, meme) or do not answer
  hello: { mech: "laugh", seconds: 5 },
  lunch: { mech: "drag", spots: [{ i: 1, at: "t" }, { i: 2, at: "l" }, { i: 0, at: "bl" }] },   // group at the top, alone in the middle left, near Echo at the bottom left
  lesson: { hold: [1], big: { 0: "HA" } },
  door: { mech: "drag", spots: [{ i: 1, at: "tl" }, { i: 0, at: "tr" }, { i: 2, at: "b" }] },
  echo_roof: { hold: [1], holdMs: 3000 },
  wipe: { mech: "wipe", seconds: 8, words: [
    { fr: "faux", en: "fake" }, { fr: "machine", en: "machine" }, { fr: "pas réel", en: "not real" }, { fr: "voleur de vie", en: "life thief" },
    { fr: "bug", en: "glitch" }, { fr: "dégage", en: "go away" }, { fr: "t’es rien", en: "you’re nothing" }, { fr: "personne t’aime", en: "nobody likes you" } ] },
  friday: { hold: [3, 4] },
  night: { write: 0 },
};

// A scene made to be played as a small game: the insults on Echo's back
STORY.beats.push({
  id: "wipe",
  line: { fr: "Les insultes restent affichées dans le dos d’Echo. Efface-les avant que les autres arrivent.", en: "The insults stay displayed on Echo’s back. Wipe them off before the others arrive." },
  prompt: { fr: "", en: "" },
  choices: [
    { label: { fr: "Tout effacer", en: "Wipe them all" }, harass: 0, passive: 0, help: 2, bond: 1,
      journal: { fr: "J’ai effacé presque toutes les insultes, aussi vite que possible. Echo n’a rien vu.", en: "I wiped off almost all the insults as fast as I could. Echo saw nothing." } },
    { label: { fr: "En effacer quelques-unes", en: "Wipe some of them" }, harass: 0, passive: 0, help: 1, bond: 0,
      journal: { fr: "J’en ai effacé quelques-unes. Les autres sont restées là.", en: "I wiped off a few. The others stayed." } },
    { label: { fr: "Trop tard", en: "Too late" }, harass: 0, passive: 1, help: 0, bond: 0,
      journal: { fr: "Je n’ai pas réussi à les effacer. Les mots sont restés.", en: "I couldn’t wipe them off. The words stayed." } },
  ],
});

// The inner voice: what the player thinks, written in "I", shown on the computer screen (it replaces the story line and partly the journal).
const THOUGHTS = {
  arrival: { fr: "C’est le nouvel élève hologramme… il est bizarre ? Tout le monde le dévisage. Je fais quoi ?", en: "It’s the new hologram student… are they weird? Everyone’s staring. What do I do?" },
  hello: { fr: "Echo tend la main à un élève… et elle passe à travers. Ça rigole. Mon ventre se serre. Si je ris pas, c’est sur moi que ça va tomber.", en: "Echo holds out a hand to a student… and it goes right through. Everyone laughs. My stomach tightens. If I don’t laugh, it’s going to land on me." },
  lunch: { fr: "J’ai trop faim, c’est déjà midi. Tiens, Echo est tout·e seul·e sur le banc. Je fais quoi ?", en: "I’m starving, it’s already noon. Look, Echo is all alone on the bench. What do I do?" },
  evening: { fr: "00:12. Mon téléphone vibre. Argh, qui m’écrit à cette heure ?! Je devrais dormir… bon, je regarde quand même.", en: "12:12 am. My phone buzzes. Ugh, who’s writing to me at this hour?! I should be asleep… fine, I look anyway." },
  lesson: { fr: "Kovasko parle de respect, et là Clarisse balance : « Echo a le droit de voter ? » Tout le monde éclate de rire. Clarisse, celle qu’on moque pour ses fringues, parce que sa famille a pas d’argent… Tiens, c’est bizarre, c’est la première fois qu’elle se moque de quelqu’un. Et moi, je fais quoi ?", en: "Kovasko talks about respect, and then Clarisse blurts out: “Is Echo allowed to vote?” Everyone cracks up. Clarisse, the one they mock for her clothes, because her family has no money… Huh, that’s weird, it’s the first time she’s making fun of someone. And me, what do I do?" },
  door: { fr: "Récré. Tout le monde monte sur le toit, vers La Serre, sauf Clarisse : elle a pas accès. Echo nous suit. Et là, un élève lui barre la porte : « Réservé aux vrais. » Mon cœur cogne.", en: "Break. Everyone heads up to the roof, to La Serre, except Clarisse: she has no access. Echo follows us. And then a student blocks the door: “Reserved for the real ones.” My heart is pounding." },
  echo_roof: { fr: "Le groupe nous laisse pas entrer non plus, ni Echo ni moi. On est mis dehors tous les deux, sur le toit. Echo regarde la ville, je suis juste à côté. Je dis quoi ?", en: "The group doesn’t let us in either, neither Echo nor me. We’re both put outside, on the roof. Echo looks at the city, I’m right next to them. What do I say?" },
  labels: { fr: "Oh non… des insultes s’affichent dans le dos d’Echo. Clarisse le traite de « voleur de vie » : pour elle, c’est à cause des holokids que sa famille est pauvre. Le groupe regarde. Moi aussi.", en: "Oh no… insults appear on Echo’s back. Clarisse calls Echo a “life thief”: for her, holokids are why her family is poor. The group is watching. So am I." },
  wipe: { fr: "Les mots restent collés sur son dos. Vite, avant que les autres arrivent ! Mes mains tremblent un peu.", en: "The words stay stuck on their back. Quick, before the others arrive! My hands are shaking a little." },
  echo_hall: { fr: "Je ressors de La Serre. Echo est là, dehors, à regarder dans le vide les lumières de la ville. « Tout le monde me dit que je suis faux. Mais qui suis-je, vraiment ? » Je sais pas quoi répondre.", en: "I come out of La Serre. Echo is there, outside, staring into the void at the city lights. “Everyone tells me I’m fake. But who am I, really?” I don’t know what to say." },
  clarisse: { fr: "Près des casiers, Clarisse est seule. Quelqu’un vient de se moquer de ses fringues. Je devrais peut-être aller vers elle…", en: "By the lockers, Clarisse is alone. Someone just made fun of her clothes. Maybe I should go to her…" },
  clarisse_talk: { fr: "Elle se confie, d’un coup. Chez elle, l’argent manque, et à La Serre on se moque d’elle pour ça. Alors elle s’en prend à Echo, comme si ça pouvait lui ouvrir la porte. Elle a l’air épuisée. Je sais pas si je dois la plaindre ou lui en vouloir.", en: "She opens up, all of a sudden. At home there’s no money, and in La Serre they mock her for it. So she goes after Echo, as if that could open the door for her. She looks exhausted. I don’t know if I should feel sorry for her or be angry." },
  clarisse_hall: { fr: "Clarisse m’attrape par la manche : « T’as vu comment ils me regardent ? Ils me parlent, enfin. » Son sourire tient mal. Elle cherche si je suis avec elle.", en: "Clarisse grabs my sleeve: “Did you see how they look at me now? They finally talk to me.” Her smile is barely holding. She’s checking if I’m with her." },
  turnoff: { fr: "Clarisse balance son plan à La Serre : éteindre Echo. Pour la première fois, les populaires lui ouvrent la porte. Je lis tout. Et si je dis rien… je suis avec eux ?", en: "Clarisse drops her plan in La Serre: switch Echo off. For the first time, the popular kids let her in. I read all of it. And if I say nothing… am I with them?" },
  origins: { fr: "Cette nuit, je retrouve Echo à Altaya. Archives, souvenirs en morceaux… Jamais je me suis senti·e aussi utile. Mais j’ai peur qu’on nous découvre.", en: "Tonight I meet Echo at Altaya. Archives, memories in pieces… I’ve never felt so useful. But I’m scared we’ll get caught." },
  echo_altaya: { fr: "Dans la salle d’Altaya, Echo fixe l’écran géant : « Ici, ils m’ont donné un nom. Mais pas de parents. » Je sais pas quoi dire.", en: "In the Altaya room, Echo stares at the giant screen: “Here, they gave me a name. But no parents.” I don’t know what to say." },
  night: { fr: "Demain, ils vont exécuter leur plan contre Echo. Je me sens mal, j’arrive pas à dormir. Je devrais peut-être faire quelque chose.", en: "Tomorrow they carry out their plan against Echo. I feel sick, I can’t sleep. Maybe I should do something." },
  friday: { fr: "Vendredi, sur le toit. Le groupe attend. Quelqu’un sort son téléphone pour filmer. Je ne sais pas quoi faire.", en: "Friday, on the roof. The group waits. Someone takes out their phone to film. I don’t know what to do." },
};
STORY.beats.forEach(b => {
  const t = THOUGHTS[b.id]; if (!t) return;
  if (t.moods) b.moodLines = t.moods; else b.line = t;
});

// Scene 1: four faces instead of three sentences (shown as emojis on the phone)
const arrival = STORY.beats.find(b => b.id === "arrival");
arrival.prompt = { fr: "Comment je réagis ?", en: "How do I react?" };
arrival.choices = [
  { label: { fr: "😊", en: "😊" }, harass: 0, passive: 0, help: 1, bond: 1,
    journal: { fr: "J’ai souri à Echo. Deux élèves l’ont vu et ont ricané. Mon sourire m’a soudain paru très lourd.", en: "I smiled at Echo. Two students saw it and snickered. My smile suddenly felt very heavy." } },
  { label: { fr: "😐", en: "😐" }, harass: 0, passive: 1, help: 0, bond: 0,
    journal: { fr: "Je n’ai rien fait. J’ai regardé mes mains pendant qu’Echo se présentait.", en: "I did nothing. I looked at my hands while Echo introduced themself." } },
  { label: { fr: "😂", en: "😂" }, harass: 1, passive: 0, help: 0, bond: -1,
    journal: { fr: "J’ai ri, comme les autres. Sur le coup, c’était facile. Maintenant, je ne sais plus de quoi je riais.", en: "I laughed, like the others. At the time it was easy. Now I don’t know what I was laughing at." } },
  { label: { fr: "😠", en: "😠" }, harass: 1, passive: 0, help: 0, bond: -1,
    journal: { fr: "J’ai regardé Echo avec colère. Je ne sais pas pourquoi ça m’énervait autant.", en: "I looked at Echo with anger. I don’t know why it annoyed me so much." },
    later: { after: 3, journal: { fr: "Echo se tient toujours un peu plus loin de moi. Je crois que mon regard du premier jour ne s’est pas effacé.", en: "Echo still stands a little further from me. I think my look from the first day hasn’t gone away." } } },
];

// Scene 3 (lunch): a flower sticker to slide: alone far from the others, near Echo, or with the group
const lunch = STORY.beats.find(b => b.id === "lunch");
lunch.prompt = { fr: "Où est-ce que je décide de m’asseoir ?", en: "Where do I decide to sit?" };
lunch.choices[2].label = { fr: "Seul·e, loin des autres", en: "Alone, far from the others" };

// Scene "00:12": the player only reacts to the meme (tap it): like, dislike, screenshot, make a meme, or do not answer
const eve = STORY.beats.find(b => b.id === "evening");
eve.choices[1].label = { fr: "Je n’aime pas", en: "Dislike" };
eve.choices[1].journal = { fr: "Je n’ai pas aimé le mème. Je l’ai fait savoir, tout bas.", en: "I disliked the meme. I made it known, quietly." };
eve.choices[6].label = { fr: "Ne pas répondre", en: "Don’t answer" };

// Door scene (5): the third choice hurts Echo ("Faire un stop"): the gauge goes up and the story goes straight to Clarisse's plan
const doorB = STORY.beats.find(b => b.id === "door");
doorB.choices[2] = {
  label: { fr: "Faire un stop", en: "Make a stop" },
  harass: 3, passive: 0, help: 0, bond: -2,
  journal: { fr: "J’ai fait un stop. Echo a pris le choc, et moi je regarde mes mains.", en: "I made a stop. Echo took the hit, and I’m looking at my hands." },
};

// After opening the door: the group does not let either of us in. We are both put outside, and we talk
const roofB = STORY.beats.find(b => b.id === "echo_roof");
roofB.moodLines = undefined; roofB.moodText = undefined;
roofB.text = { fr: "Le groupe ne nous laisse pas entrer non plus, ni toi ni Echo. Vous êtes mis dehors tous les deux, sur le toit, côte à côte. Echo regarde la ville.", en: "The group doesn’t let either of you in. You’re both put outside, on the roof, side by side. Echo looks at the city." };
roofB.choices = [
  { label: { fr: "Lui demander si ça va", en: "Ask if they’re okay" }, harass: 0, passive: 0, help: 1, bond: 1,
    journal: { fr: "J’ai demandé à Echo si ça allait. Echo a haussé les épaules, mais est resté·e là.", en: "I asked Echo if they were okay. Echo shrugged, but stayed." } },
  { label: { fr: "Rester à côté, sans parler", en: "Stay next to them, without speaking" }, harass: 0, passive: 0, help: 1, bond: 1,
    journal: { fr: "Je suis resté·e à côté d’Echo, sans parler. Le silence n’était pas lourd.", en: "I stayed next to Echo without speaking. The silence wasn’t heavy." } },
  { label: { fr: "« T’es pas vraiment humain »", en: "“You’re not really human”" }, harass: 3, passive: 0, help: 0, bond: -2,
    journal: { fr: "J’ai dit « t’es pas vraiment humain ». Les mots sont sortis tout seuls, et je ne peux pas les reprendre.", en: "I said “you’re not really human”. The words came out by themselves, and I can’t take them back." } },
];

// After doing nothing: I come out of La Serre and find Echo alone, staring at the city lights
const hallB = STORY.beats.find(b => b.id === "echo_hall");
hallB.text = { fr: "Tu ressors de La Serre. Echo est là, dehors, et regarde dans le vide les lumières de la ville. « Tout le monde me dit que je suis faux. Mais qui suis-je, vraiment ? »", en: "You come out of La Serre. Echo is there, outside, staring into the void at the city lights. “Everyone tells me I’m fake. But who am I, really?”" };
STORY.beats.find(b => b.id === "echo_altaya").moodLines = undefined; STORY.beats.find(b => b.id === "echo_altaya").moodText = undefined;   // the inner voice is the line shown
hallB.moodLines = undefined; hallB.moodText = undefined; hallB.alone = undefined; roofB.alone = undefined;   // no "closed" variant: these scenes are the same for everyone
hallB.choices = [
  { label: { fr: "Lui demander comment il·elle va", en: "Ask how they are" }, harass: 0, passive: 0, help: 1, bond: 1,
    journal: { fr: "J’ai demandé à Echo comment iel allait.", en: "I asked Echo how they were." } },
  { label: { fr: "Lui parler de son identité", en: "Talk about who they are" }, harass: 0, passive: 0, help: 1, bond: 2,
    journal: { fr: "On a parlé de qui est Echo, vraiment. Je n’avais pas de réponse, mais j’ai écouté.", en: "We talked about who Echo really is. I had no answer, but I listened." } },
  { label: { fr: "Rester là, sans rien dire", en: "Stay there, saying nothing" }, harass: 0, passive: 1, help: 0, bond: 1,
    journal: { fr: "Je suis resté·e là, sans rien dire.", en: "I stayed there, saying nothing." } },
  { label: { fr: "S’excuser", en: "Apologize" }, harass: 0, passive: 0, help: 1, bond: 2,
    journal: { fr: "Je me suis excusé·e auprès d’Echo de ne rien avoir fait à la porte.", en: "I apologized to Echo for doing nothing at the door." } },
];

// Scenes 4 to 6, as drawn: the phone asks in "I" too
STORY.beats.find(b => b.id === "door").prompt = { fr: "Qu’est-ce que je fais ?", en: "What do I do?" };
const roof = STORY.beats.find(b => b.id === "echo_roof");
roof.prompt = { fr: "Qu’est-ce que je fais ?", en: "What do I do?" };

// Altaya only opens for a player who is close to Echo
STORY.beats.find(b => b.id === "origins").if = { bondMin: 4 };
STORY.beats.find(b => b.id === "origins").prompt = { fr: "Qu’est-ce que je fais ?", en: "What do I do?" };
STORY.beats.find(b => b.id === "echo_altaya").prompt = { fr: "Qu’est-ce que je fais ?", en: "What do I do?" };

// From the roof on, the story branches according to the choice at the door:
//  - the player opened the door or said stop  -> Echo on the roof, the insults on Echo's back, wiping them
//  - the player did nothing                   -> Echo alone in the hallway, then Clarisse alone, then Clarisse in the hall
const doorBeat = STORY.beats.find(b => b.id === "door");
doorBeat.choices[0].flag = "doorOpened"; doorBeat.choices[1].flag = "doorNothing"; doorBeat.choices[2].flag = "doorStop";   // "doorStop" (hurting Echo) skips these scenes and goes straight to Clarisse's plan
["echo_roof", "labels", "wipe"].forEach(id => { STORY.beats.find(b => b.id === id).if = { anyFlag: ["doorOpened"] }; });   // door opened: both put outside, then the insults
["echo_hall", "clarisse_hall"].forEach(id => { const b = STORY.beats.find(x => x.id === id); b.if = { anyFlag: ["doorNothing"] }; b.prompt = { fr: "Qu’est-ce que je fais ?", en: "What do I do?" }; });
STORY.beats.find(b => b.id === "clarisse_hall").choices[1].label = { fr: "Dire que ça ne me regarde pas", en: "Say it’s none of my business" };

// Friday decides how it ends: stopping the plan, or letting it go ahead (and whether the player filmed)
const fri = STORY.beats.find(b => b.id === "friday");
fri.choices[0].flags = ["filmed"]; fri.choices[1].flags = ["silent"];
fri.choices[3].flags = ["planStopped"]; fri.choices[4].flags = ["planStopped"];

// Clarisse, for everyone: alone near the lockers after being mocked. The player can listen, tell her to leave Echo alone, laugh with the others, or ignore her.
// If the player listens, she opens up (next scene), and it comes back later: her messages in her plan, and the ending.
const clar = STORY.beats.find(b => b.id === "clarisse");
clar.if = undefined; clar.alone = undefined; clar.moodLines = undefined; clar.moodText = undefined;
clar.text = { fr: "Dans le couloir, Clarisse est seule près des casiers. Quelqu’un vient de se moquer de ses vêtements : sa famille n’a pas d’argent, et à La Serre on le lui fait payer. Tu peux aller vers elle, ou pas.", en: "In the hallway, Clarisse is alone by the lockers. Someone just made fun of her clothes: her family has no money, and in La Serre they make her pay for it. You can go to her, or not." };
clar.prompt = { fr: "Qu’est-ce que je fais ?", en: "What do I do?" };
clar.choices = [
  { label: { fr: "L’écouter sans juger", en: "Listen without judging" }, harass: 0, passive: 0, help: 1, bond: 0, flags: ["clarisseListened"],
    journal: { fr: "Je suis allé·e vers Clarisse et je l’ai laissée parler.", en: "I went to Clarisse and let her talk." } },
  { label: { fr: "Lui dire de laisser Echo tranquille", en: "Tell her to leave Echo alone" }, harass: 0, passive: 0, help: 1, bond: 1, flags: ["clarisseToldStop"],
    journal: { fr: "J’ai dit à Clarisse de laisser Echo tranquille. Elle m’a regardé·e, sans répondre.", en: "I told Clarisse to leave Echo alone. She looked at me without answering." } },
  { label: { fr: "Rire avec les autres", en: "Laugh with the others" }, harass: 2, passive: 0, help: 0, bond: -1, flags: ["clarisseMocked"],
    journal: { fr: "J’ai ri avec les autres de Clarisse. Sur le coup c’était facile. Elle m’a vu·e.", en: "I laughed at Clarisse with the others. At the time it was easy. She saw me." } },
  { label: { fr: "L’ignorer", en: "Ignore her" }, harass: 0, passive: 1, help: 0, bond: 0,
    journal: { fr: "J’ai fait comme si je ne voyais pas Clarisse.", en: "I acted like I didn’t see Clarisse." } },
];
STORY.beats.push({
  id: "clarisse_talk",
  title: { fr: "Clarisse se confie", en: "Clarisse opens up" },
  text: { fr: "Clarisse se confie : chez elle, l’argent manque, et à La Serre on se moque d’elle pour ça. Alors elle s’en prend à Echo, comme si ça pouvait lui ouvrir la porte.", en: "Clarisse opens up: at home there’s no money, and in La Serre they mock her for it. So she goes after Echo, as if that could open the door for her." },
  prompt: { fr: "Qu’est-ce que je fais ?", en: "What do I do?" },
  if: { anyFlag: ["clarisseListened"] },
  choices: [
    { label: { fr: "Lui dire que ce n’est pas la faute d’Echo", en: "Tell her it’s not Echo’s fault" }, harass: 0, passive: 0, help: 1, bond: 1, flags: ["clarisseToldStop"],
      journal: { fr: "J’ai dit à Clarisse que ce n’était pas la faute d’Echo.", en: "I told Clarisse it wasn’t Echo’s fault." } },
    { label: { fr: "Lui dire que ça n’excuse pas ce qu’elle fait", en: "Tell her it doesn’t excuse what she does" }, harass: 0, passive: 0, help: 1, bond: 0, flags: ["clarisseToldStop"],
      journal: { fr: "J’ai dit à Clarisse que je comprenais, mais que ça n’excusait rien.", en: "I told Clarisse I understood, but that it didn’t excuse anything." } },
    { label: { fr: "Juste rester avec elle", en: "Just stay with her" }, harass: 0, passive: 0, help: 0, bond: 0,
      journal: { fr: "Je suis resté·e avec Clarisse, sans rien dire de plus.", en: "I stayed with Clarisse, without saying more." } },
  ],
  journal: { fr: "", en: "" },
  line: THOUGHTS.clarisse_talk,   // the inner voice, like every other scene
});

// The red thread: the scenes the game plays, in order. The other scenes stay written in this file but are not played.
// (To play one again, add its id here, in the right place.)
// The night before the plan: first I choose who to write to (or switch the phone off), then I answer in that conversation
const nightB = STORY.beats.find(b => b.id === "night");
nightB.text = { fr: "Tu es dans ton lit, le téléphone allumé dans le noir. Demain, après les cours, le plan de Clarisse contre Echo.", en: "You’re in bed, the phone lit in the dark. Tomorrow, after class, Clarisse’s plan against Echo." };
nightB.choices = [
  { label: { fr: "Écrire à Echo", en: "Write to Echo" }, harass: 0, passive: 0, help: 0, bond: 0, flag: "nightEcho", kind: "action",
    journal: { fr: "J’ai ouvert la conversation avec Echo.", en: "I opened the conversation with Echo." } },
  { label: { fr: "Écrire à Clarisse", en: "Write to Clarisse" }, harass: 0, passive: 0, help: 0, bond: 0, flag: "nightClarisse", kind: "action",
    journal: { fr: "J’ai ouvert la conversation avec Clarisse.", en: "I opened the conversation with Clarisse." } },
  { label: { fr: "Éteindre le téléphone", en: "Switch the phone off" }, harass: 0, passive: 1, help: 0, bond: 0, kind: "ignore",
    journal: { fr: "J’ai éteint mon téléphone. Le silence m’a fait plus peur que les messages.", en: "I switched my phone off. The silence scared me more than the messages." } },
];
delete INTERACT.night;
const nightEcho = { ...nightB, id: "night_echo", if: { anyFlag: ["nightEcho"] }, chat: { thread: "echo", readyAt: 3500 },
  line: nightB.line,
  choices: [
    { label: { fr: "Écrire mes mots", en: "Write my own words" }, harass: 0, passive: 0, help: 1, bond: 1, kind: "write",
      journal: { fr: "J’ai écrit à Echo. Les mots ont mis longtemps à sortir, mais ils sont partis.", en: "I wrote to Echo. The words took a long time to come out, but they went." } },
    { label: { fr: "Je suis là, Echo.", en: "I’m here, Echo." }, harass: 0, passive: 0, help: 1, bond: 1, kind: "reply",
      journal: { fr: "J’ai écrit à Echo que j’étais là.", en: "I wrote to Echo that I was there." } },
    { label: { fr: "Demain, reste loin du toit.", en: "Tomorrow, stay away from the roof." }, harass: 0, passive: 0, help: 2, bond: 2, flag: "warnedEcho", kind: "reply",
      journal: { fr: "J’ai dit à Echo de rester loin du toit demain. Je n’ai pas tout expliqué, mais j’ai prévenu.", en: "I told Echo to stay away from the roof tomorrow. I didn’t explain everything, but I warned." } },
  ] };
const nightClar = { ...nightB, id: "night_clarisse", if: { anyFlag: ["nightClarisse"] }, chat: { thread: "private", readyAt: 3500 },
  line: nightB.line,
  choices: [
    { label: { fr: "Arrête, s’il te plaît.", en: "Please stop." }, harass: 0, passive: 0, help: 1, bond: 0, flag: "talkedClarisse", kind: "reply",
      journal: { fr: "J’ai demandé à Clarisse d’arrêter. Elle a lu, puis elle a répondu à peine.", en: "I asked Clarisse to stop. She read it and barely answered." } },
    { label: { fr: "Je ne viendrai pas demain.", en: "I won’t come tomorrow." }, harass: 0, passive: 0, help: 1, bond: 0, kind: "reply",
      journal: { fr: "J’ai dit à Clarisse que je ne viendrais pas.", en: "I told Clarisse I wouldn’t come." } },
    { label: { fr: "Ok, je viens.", en: "Ok, I’ll come." }, harass: 0, passive: 1, help: 0, bond: -1, kind: "reply",
      journal: { fr: "J’ai écrit « ok, je viens ». Je ne sais pas pourquoi.", en: "I wrote “ok, I’ll come”. I don’t know why." } },
  ] };
nightEcho.line = { fr: "Je ne sais pas quoi écrire à Echo… mais je dois lui écrire.", en: "I don’t know what to write to Echo… but I have to write." };
nightClar.line = { fr: "Clarisse est en ligne. Je pourrais lui écrire, lui dire de ne pas le faire.", en: "Clarisse is online. I could write to her, tell her not to do it." };
INTERACT.night_echo = { write: 0 };
STORY.beats.push(nightEcho, nightClar);

// Evening: Sam's message, the screenshot kept as proof, a meme only to defend Echo
eve.choices[2].journal = { fr: "J’ai fait une capture d’écran du mème. Une preuve, au cas où : pour le prof.", en: "I took a screenshot of the meme. Proof, just in case: for the teacher." };
eve.choices[2].flag = "memeProof";
eve.choices[2].later = { after: 3, journal: { fr: "Ma capture est toujours dans mon téléphone. Une preuve pour le prof, si un jour j’ose.", en: "My screenshot is still in my phone. Proof for the teacher, if I ever dare." } };
const memeC = eve.choices[7];
delete memeC.mock; delete memeC.support;
Object.assign(memeC, { label: { fr: "Créer un mème pour défendre Echo", en: "Make a meme to defend Echo" }, help: 1, bond: 1,
  journal: { fr: "J’ai fait un mème pour défendre Echo. Personne n’a vraiment compris, mais je l’ai posté.", en: "I made a meme to defend Echo. Nobody really got it, but I posted it." } });

// Door scene: the third choice is to block the door too
doorB.choices[2].label = { fr: "Lui barrer aussi la porte", en: "Block the door too" };
doorB.choices[2].journal = { fr: "Je lui ai barré la porte, moi aussi. Echo a pris le choc, et moi je regarde mes mains.", en: "I blocked the door too. Echo took the hit, and I’m looking at my hands." };

const SPINE = ["arrival", "hello", "lunch", "evening", "lesson", "door", "echo_roof", "labels", "wipe", "echo_hall", "clarisse", "clarisse_talk", "clarisse_hall", "turnoff", "origins", "echo_altaya", "night", "night_echo", "night_clarisse", "friday"];   // a scene with an `if` is only played when its condition holds
STORY.beats = SPINE.map(id => STORY.beats.find(b => b.id === id)).filter(Boolean);
