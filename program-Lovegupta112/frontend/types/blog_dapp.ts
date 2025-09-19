/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/blog_dapp.json`.
 */
import { Idl } from "@coral-xyz/anchor";

/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/blog_dapp.json`.
 */
/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/blog_dapp.json`.
 */
export type BlogDapp = {
  "address": "BmP9bJB3z33LfU23a2P6aybyZLnNFrZdBZfptgfihRiX",
  "metadata": {
    "name": "blogDapp",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addBlog",
      "discriminator": [
        23,
        24,
        162,
        194,
        88,
        64,
        246,
        149
      ],
      "accounts": [
        {
          "name": "blogAuthor",
          "writable": true,
          "signer": true
        },
        {
          "name": "blog",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  66,
                  76,
                  79,
                  71,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "arg",
                "path": "title"
              },
              {
                "kind": "account",
                "path": "blogAuthor"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "commentBlog",
      "discriminator": [
        144,
        86,
        63,
        157,
        233,
        251,
        135,
        247
      ],
      "accounts": [
        {
          "name": "commentAuthor",
          "writable": true,
          "signer": true
        },
        {
          "name": "comment",
          "writable": true
        },
        {
          "name": "blog",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "content",
          "type": "string"
        }
      ]
    },
    {
      "name": "dislikeBlog",
      "discriminator": [
        10,
        155,
        71,
        42,
        88,
        10,
        251,
        73
      ],
      "accounts": [
        {
          "name": "reactionAuthor",
          "writable": true,
          "signer": true
        },
        {
          "name": "reaction",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  82,
                  69,
                  65,
                  67,
                  84,
                  73,
                  79,
                  78,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "reactionAuthor"
              },
              {
                "kind": "account",
                "path": "blog"
              }
            ]
          }
        },
        {
          "name": "blog",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "likeBlog",
      "discriminator": [
        135,
        108,
        212,
        205,
        27,
        188,
        171,
        54
      ],
      "accounts": [
        {
          "name": "reactionAuthor",
          "writable": true,
          "signer": true
        },
        {
          "name": "reaction",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  82,
                  69,
                  65,
                  67,
                  84,
                  73,
                  79,
                  78,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "reactionAuthor"
              },
              {
                "kind": "account",
                "path": "blog"
              }
            ]
          }
        },
        {
          "name": "blog",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "removeCommentBlog",
      "discriminator": [
        92,
        94,
        26,
        255,
        130,
        103,
        0,
        194
      ],
      "accounts": [
        {
          "name": "commentAuthor",
          "writable": true,
          "signer": true,
          "relations": [
            "comment"
          ]
        },
        {
          "name": "comment",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "removeReactionBlog",
      "discriminator": [
        156,
        118,
        207,
        103,
        249,
        72,
        15,
        160
      ],
      "accounts": [
        {
          "name": "reactionAuthor",
          "writable": true,
          "signer": true,
          "relations": [
            "reaction"
          ]
        },
        {
          "name": "reaction",
          "writable": true
        },
        {
          "name": "blog",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "saveBlog",
      "discriminator": [
        48,
        101,
        189,
        236,
        180,
        65,
        116,
        237
      ],
      "accounts": [
        {
          "name": "bookmarkAuthor",
          "writable": true,
          "signer": true
        },
        {
          "name": "bookmark",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  66,
                  79,
                  79,
                  75,
                  77,
                  65,
                  82,
                  75,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "bookmarkAuthor"
              },
              {
                "kind": "account",
                "path": "blog"
              }
            ]
          }
        },
        {
          "name": "blog",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "tipForBlog",
      "discriminator": [
        170,
        213,
        200,
        245,
        168,
        187,
        250,
        181
      ],
      "accounts": [
        {
          "name": "tipAuthor",
          "writable": true,
          "signer": true
        },
        {
          "name": "tip",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  84,
                  73,
                  80,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "tipAuthor"
              },
              {
                "kind": "account",
                "path": "blog"
              }
            ]
          }
        },
        {
          "name": "blog",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "tipAmt",
          "type": "u64"
        }
      ]
    },
    {
      "name": "unsaveBlog",
      "discriminator": [
        248,
        140,
        164,
        234,
        220,
        250,
        12,
        114
      ],
      "accounts": [
        {
          "name": "bookmarkAuthor",
          "writable": true,
          "signer": true,
          "relations": [
            "bookmark"
          ]
        },
        {
          "name": "bookmark",
          "writable": true
        },
        {
          "name": "blog",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "updateBlog",
      "discriminator": [
        252,
        54,
        5,
        181,
        182,
        6,
        112,
        203
      ],
      "accounts": [
        {
          "name": "blogAuthor",
          "writable": true,
          "signer": true,
          "relations": [
            "blog"
          ]
        },
        {
          "name": "blog",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  66,
                  76,
                  79,
                  71,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "blog.title",
                "account": "blog"
              },
              {
                "kind": "account",
                "path": "blogAuthor"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "content",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "blog",
      "discriminator": [
        152,
        205,
        212,
        154,
        186,
        203,
        207,
        244
      ]
    },
    {
      "name": "bookmark",
      "discriminator": [
        19,
        37,
        17,
        23,
        221,
        30,
        27,
        144
      ]
    },
    {
      "name": "comment",
      "discriminator": [
        150,
        135,
        96,
        244,
        55,
        199,
        50,
        65
      ]
    },
    {
      "name": "reaction",
      "discriminator": [
        226,
        61,
        100,
        191,
        223,
        221,
        142,
        139
      ]
    },
    {
      "name": "tip",
      "discriminator": [
        87,
        218,
        38,
        122,
        15,
        197,
        190,
        230
      ]
    }
  ],
  "events": [
    {
      "name": "addCommentEvent",
      "discriminator": [
        250,
        138,
        77,
        80,
        232,
        70,
        48,
        59
      ]
    },
    {
      "name": "addReactionEvent",
      "discriminator": [
        25,
        153,
        255,
        215,
        190,
        6,
        11,
        195
      ]
    },
    {
      "name": "bookmarkBlogEvent",
      "discriminator": [
        204,
        80,
        210,
        156,
        43,
        244,
        4,
        221
      ]
    },
    {
      "name": "editBlogEvent",
      "discriminator": [
        3,
        10,
        78,
        49,
        151,
        17,
        72,
        187
      ]
    },
    {
      "name": "initializeBlogEvent",
      "discriminator": [
        121,
        248,
        225,
        246,
        215,
        13,
        146,
        159
      ]
    },
    {
      "name": "removeBlogEvent",
      "discriminator": [
        179,
        10,
        90,
        209,
        92,
        92,
        93,
        158
      ]
    },
    {
      "name": "removeCommentEvent",
      "discriminator": [
        14,
        237,
        95,
        71,
        184,
        236,
        18,
        77
      ]
    },
    {
      "name": "removeReactionEvent",
      "discriminator": [
        223,
        238,
        192,
        208,
        254,
        131,
        119,
        152
      ]
    },
    {
      "name": "tipEvent",
      "discriminator": [
        213,
        36,
        191,
        50,
        28,
        25,
        189,
        252
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "contentTooLong",
      "msg": "Cannot initialize, content too long"
    },
    {
      "code": 6001,
      "name": "titleTooLong",
      "msg": "Cannot initialize, title too long"
    },
    {
      "code": 6002,
      "name": "minLikesReached",
      "msg": "Minimum number of Likes Reached"
    },
    {
      "code": 6003,
      "name": "maxLikesReached",
      "msg": "Maximum number of Likes Reached"
    },
    {
      "code": 6004,
      "name": "minDislikesReached",
      "msg": "Minimum number of Dislikes Reached"
    },
    {
      "code": 6005,
      "name": "maxDislikesReached",
      "msg": "Maximum number of Dislikes Reached"
    },
    {
      "code": 6006,
      "name": "minBookmarkReached",
      "msg": "Minimum number of Bookmark Reached"
    },
    {
      "code": 6007,
      "name": "maxBookmarkReached",
      "msg": "Maximum number of Bookmark Reached"
    },
    {
      "code": 6008,
      "name": "maxBlogTipReached",
      "msg": "Maximum number of Blog tip Reached"
    },
    {
      "code": 6009,
      "name": "commentTooLong",
      "msg": "Comment too Long"
    },
    {
      "code": 6010,
      "name": "cannotTipOwnBlog",
      "msg": "Can not tip own blog"
    },
    {
      "code": 6011,
      "name": "insufficientBalance",
      "msg": "Insufficient balance to tip"
    }
  ],
  "types": [
    {
      "name": "addCommentEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "commentAuthor",
            "type": "pubkey"
          },
          {
            "name": "blog",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "addReactionEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "reactionAuthor",
            "type": "pubkey"
          },
          {
            "name": "blog",
            "type": "pubkey"
          },
          {
            "name": "reactionType",
            "type": {
              "defined": {
                "name": "reactionType"
              }
            }
          }
        ]
      }
    },
    {
      "name": "blog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "blogAuthor",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "likes",
            "type": "u64"
          },
          {
            "name": "dislikes",
            "type": "u64"
          },
          {
            "name": "bookmarked",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "bookmark",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bookmarkAuthor",
            "type": "pubkey"
          },
          {
            "name": "relatedBlog",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "bookmarkBlogEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bookmarkAuthor",
            "type": "pubkey"
          },
          {
            "name": "blog",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "comment",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "commentAuthor",
            "type": "pubkey"
          },
          {
            "name": "relatedBlog",
            "type": "pubkey"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "editBlogEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "blogAuthor",
            "type": "pubkey"
          },
          {
            "name": "blog",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "initializeBlogEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "blogAuthor",
            "type": "pubkey"
          },
          {
            "name": "blog",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "reaction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "reactionAuthor",
            "type": "pubkey"
          },
          {
            "name": "relatedBlog",
            "type": "pubkey"
          },
          {
            "name": "reaction",
            "type": {
              "defined": {
                "name": "reactionType"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "reactionType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "like"
          },
          {
            "name": "disLike"
          }
        ]
      }
    },
    {
      "name": "removeBlogEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "blogAuthor",
            "type": "pubkey"
          },
          {
            "name": "blog",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "removeCommentEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "commentAuthor",
            "type": "pubkey"
          },
          {
            "name": "blog",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "removeReactionEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "reactionAuthor",
            "type": "pubkey"
          },
          {
            "name": "blog",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "tip",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tipAuthor",
            "type": "pubkey"
          },
          {
            "name": "relatedBlog",
            "type": "pubkey"
          },
          {
            "name": "totalTip",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "tipEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "blogAuthor",
            "type": "pubkey"
          },
          {
            "name": "blog",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          }
        ]
      }
    }
  ]
} & Idl;

