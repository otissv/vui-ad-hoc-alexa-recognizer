/*
MIT License

Copyright (c) 2017 Ilya Shubentsov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var expect = require("chai").expect;
var recognizer = require("../index.js");

describe("vui-ad-hoc-alexa-recognizer", function() {
  describe("Simple Matches", function() {
    it("verify simple utterance without slots matches", function() {
      let result = recognizer.Recognizer.matchText("test me");
      expect(result).to.eql({"name": "TestIntent", "slots": {}});
    });
    it("verify simple utterance matches built in AMAZON.HelpIntent", function() {
      let result = recognizer.Recognizer.matchText("Help");
      expect(result).to.eql({"name": "AMAZON.HelpIntent", "slots": {}});
    });
    it("verify simple utterance with a custom slot matches", function() {
      let result = recognizer.Recognizer.matchText("One of the minions is Bob");
      expect(result).to.eql(
        {"name": "MinionIntent",
         "slots": {
          "MinionSlot": {
            "name": "MinionSlot",
            "value": "Bob"
          }
        }});
    });
  });



  describe("AMAZON.NUMBER Matches", function() {
    it("verify simple utterance with two AMAZON.NUMBER slots matches", function() {
      let result = recognizer.Recognizer.matchText('here is twenty five thousand three hundred twelve and also 6035551212');
      expect(result).to.eql(
        {"name": "BlahIntent",
           "slots": {
            "BlahSlot": {
              "name": "BlahSlot",
              "value": "25312"
            },
            "BlehSlot": {
              "name": "BlehSlot",
              "value": "6035551212"
            }
          }
        });
    });
    it("verify that leading zeroes are preserved and parsing works with words and numbers and 'oh' is treated as 0 when part of a number", function() {
      let result = recognizer.Recognizer.matchText('here is zero oh twenty five thousand three hundred twelve and also 006035551212');
      expect(result).to.eql(
        {"name": "BlahIntent",
           "slots": {
            "BlahSlot": {
              "name": "BlahSlot",
              "value": "0025312"
            },
            "BlehSlot": {
              "name": "BlehSlot",
              "value": "006035551212"
            }
          }
        });
    });
  });




  describe("AMAZON.DATE Matches", function() {
    it("verify AMAZON.DATE slot and today matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('date is today');
      let today = new Date();
      let todayString = "" + today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" +  ("0" + today.getDate()).slice(-2)  ;
      expect(result).to.eql(
        {"name": "DateIntent",
           "slots": {
             "DateSlot": {
               "name": "DateSlot",
               "value": todayString
            }
          }
        });
    });

    it("verify AMAZON.DATE slot and yesterday matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('date is yesterday');
      let today = new Date();
      today.setDate(today.getDate() - 1);
      let todayString = "" + today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" +  ("0" + today.getDate()).slice(-2)  ;
      expect(result).to.eql(
        {"name": "DateIntent",
           "slots": {
             "DateSlot": {
               "name": "DateSlot",
               "value": todayString
            }
          }
        });
    });

    it("verify AMAZON.DATE slot and tomorrow matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('date is tomorrow');
      let today = new Date();
      today.setDate(today.getDate() + 1);
      let todayString = "" + today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" +  ("0" + today.getDate()).slice(-2)  ;
      expect(result).to.eql(
        {"name": "DateIntent",
           "slots": {
             "DateSlot": {
               "name": "DateSlot",
               "value": todayString
            }
          }
        });
    });

    it("verify simple utterance with AMAZON.DATE slot and full calendar date matches", function() {
      let result = recognizer.Recognizer.matchText('date is March first twenty seventeen');
      expect(result).to.eql(
        {"name": "DateIntent",
           "slots": {
             "DateSlot": {
               "name": "DateSlot",
               "value": "2017-03-01"
            }
          }
        });
    });

    it("verify simple utterance with AMAZON.DATE slot and month and year matches", function() {
      let result = recognizer.Recognizer.matchText('date is March twenty seventeen');
      expect(result).to.eql(
        {"name": "DateIntent",
           "slots": {
             "DateSlot": {
               "name": "DateSlot",
               "value": "2017-03"
            }
          }
        });
    });

    it("verify simple utterance with AMAZON.DATE slot and year as two two digit words matches", function() {
      let result = recognizer.Recognizer.matchText('date is twenty seventeen');
      expect(result).to.eql(
        {"name": "DateIntent",
         "slots": {
           "DateSlot": {
             "name": "DateSlot",
             "value": "2017"
           }
         }});
    });

    it("verify simple utterance with AMAZON.DATE slot and year fully spelled out using words matches", function() {
      let result = recognizer.Recognizer.matchText('date is two thousand seventeen');
      expect(result).to.eql(
        {"name": "DateIntent",
         "slots": {
           "DateSlot": {
             "name": "DateSlot",
             "value": "2017"
           }
         }});
    });

    it("verify simple utterance with AMAZON.DATE slot and year as 4 digits matches", function() {
      let result = recognizer.Recognizer.matchText('date is 2017');
      expect(result).to.eql(
        {"name": "DateIntent",
         "slots": {
           "DateSlot": {
             "name": "DateSlot",
             "value": "2017"
           }
         }});
    });

    it("verify simple utterance with AMAZON.DATE slot and calendar date without year matches", function() {
      let result = recognizer.Recognizer.matchText('date is March first');
      let today = new Date();
      let marchFirst = new Date();
      marchFirst.setMonth(2);
      marchFirst.setDate(1);
      let year = today.getFullYear();
      if(marchFirst < today){
        year++;
      }
      let marchFirstString = "" + year + "-03-01";

      expect(result).to.eql(
        {"name": "DateIntent",
           "slots": {
             "DateSlot": {
               "name": "DateSlot",
               "value": marchFirstString
            }
          }
        });
    });

    it("verify simple utterance with AMAZON.DATE slot and month matches", function() {
      let result = recognizer.Recognizer.matchText('date is March');
      let today = new Date();
      let month = today.getMonth();
      let year = today.getFullYear();
      if(month > 2){
        year ++;
      }
      let marchString = "" + year + "-03";

      expect(result).to.eql(
        {"name": "DateIntent",
           "slots": {
             "DateSlot": {
               "name": "DateSlot",
               "value": marchString
            }
          }
        });
    });
  });

  describe("AMAZON.TIME Matches", function() {
    it("verify AMAZON.TIME slot and noon matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does noon work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "12:00"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and midnight matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does midnight work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "00:00"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and morning matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does morning work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "MO"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and this morning matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does this morning work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "MO"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and night matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does night work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "NI"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and this night matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does this night work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "NI"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and afternoon matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does afternoon work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "AF"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and after noon matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does after noon work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "AF"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and this afternoon matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does this afternoon work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "AF"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and this after noon matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does this after noon work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "AF"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and evening matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does evening work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "EV"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and this evening matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does this evening work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "EV"
            }
          }
        });
    });

    it("verify AMAZON.TIME slot and five matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText('does five work for you');
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "05:00"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and eleven o'clock matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does eleven o'clock work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "11:00"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and 24 o'clock does not match and returns undefined", function() {
      let result = recognizer.Recognizer.matchText("does twenty four o'clock work for you");
      expect(typeof result).to.equal("undefined");
    });
    it("verify AMAZON.TIME slot and eleven twenty three matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does eleven twenty three work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "11:23"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and 11 23 am matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does 11 23 am work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "11:23"
            }
          }
        });
    });
    it("verify AMAZON.TIME slot and 11 oh five pm matches and returns the correct value", function() {
      let result = recognizer.Recognizer.matchText("does 11 oh five pm work for you");
      expect(result).to.eql(
        {"name": "TimeIntent",
           "slots": {
             "TimeSlot": {
               "name": "TimeSlot",
               "value": "23:05"
            }
          }
        });
    });


  });

  describe("Wild card processing", function() {
    it("verify simple utterance with an AMAZON.US_FIRST_NAME slot with INCLUDE_WILDCARD_MATCH matches", function() {
      let result = recognizer.Recognizer.matchText("My first name is blah blah");
      expect(result).to.eql(
        {"name": "FirstNameIntent",
         "slots": {
          "FirstNameSlot": {
            "name": "FirstNameSlot",
            "value": "blah blah"
          }
        }});
    });
    it("verify simple utterance with a custom slot with INCLUDE_WILDCARD_MATCH matches", function() {
      let result = recognizer.Recognizer.matchText("One of the minions is banana");
      expect(result).to.eql(
        {"name": "MinionIntent",
         "slots": {
          "MinionSlot": {
            "name": "MinionSlot",
            "value": "banana"
          }
        }});
    });
    it("verify simple utterance with a custom slot with INCLUDE_WILDCARD_MATCH matches and retains original capitalization if the name is found in the list", function() {
      let result = recognizer.Recognizer.matchText("One of the minions is bob");
      expect(result).to.eql(
        {"name": "MinionIntent",
         "slots": {
          "MinionSlot": {
            "name": "MinionSlot",
            "value": "Bob"
          }
        }});
    });
  });

  describe("SoundEx processing", function() {
    it("verify simple utterance with an exact custom slot still matches", function() {
      let result = recognizer.Recognizer.matchText("Another minion is Bob");
      expect(result).to.eql(
        {"name": "MinionIntent",
         "slots": {
          "MinionSlot": {
            "name": "MinionSlot",
            "value": "Bob"
          }
        }});
    });
    it("verify simple utterance with an inexact custom slot also matches", function() {
      let result = recognizer.Recognizer.matchText("Another minion is bop");
      expect(result).to.eql(
        {"name": "MinionIntent",
         "slots": {
          "MinionSlot": {
            "name": "MinionSlot",
            "value": "Bob"
          }
        }});
    });
    it("verify simple utterance with non-matching custom slot soundex value doesn't match", function() {
      let result = recognizer.Recognizer.matchText("Another minion is blah");
      expect(typeof result).to.equal("undefined");
    });
  });


  describe("Special processing", function() {
    it("verify simple utterance with a custom slot matches and retains original capitalization", function() {
      let result = recognizer.Recognizer.matchText("One of the minions is bob");
      expect(result).to.eql(
        {"name": "MinionIntent",
         "slots": {
          "MinionSlot": {
            "name": "MinionSlot",
            "value": "Bob"
          }
        }});
    });
    it("verify that an utterance with a $ matches on 'dollars'", function() {
      let result = recognizer.Recognizer.matchText('the first price is $1000 and the second price is $525000');
      expect(result).to.eql(
        {"name": "PriceIntent",
         "slots": {
           "PriceOneSlot": {
             "name": "PriceOneSlot",
             "value": "1000"
           },
           "PriceTwoSlot": {
            "name": "PriceTwoSlot",
            "value": "525000"
           }
        }});
    });
    it("verify that an utterance with a 'dollars' spelled out also matches", function() {
      let result = recognizer.Recognizer.matchText('the first price is 1000 dollars and the second price is 525000 dollars');
      expect(result).to.eql(
        {"name": "PriceIntent",
         "slots": {
           "PriceOneSlot": {
             "name": "PriceOneSlot",
             "value": "1000"
           },
           "PriceTwoSlot": {
            "name": "PriceTwoSlot",
            "value": "525000"
           }
        }});
    });
    it("verify that repeated matches work", function() {
      let result = recognizer.Recognizer.matchText("test me");
      result = recognizer.Recognizer.matchText("Help");
      result = recognizer.Recognizer.matchText("One of the minions is stewart");
      expect(result).to.eql(
        {"name": "MinionIntent",
         "slots": {
          "MinionSlot": {
            "name": "MinionSlot",
            "value": "Stewart"
          }
        }});
    });
  });
});
