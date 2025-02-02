import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FcPlus } from "react-icons/fc";
import { GrFormSubtract } from "react-icons/gr";

const Recomended = ({ addToCart }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [spinner, setSpinner] = useState(0);
  const [menuqty, setMenuqty] = useState([]);
  const [isStrted, setIsStarted] = useState(0);
  // eslint-disable-next-line
  const [isBlind, setIsBlind] = useState(1);
  // Fetch menu item data
  const getMenuItemData = () => {
    const url = `${process.env.REACT_APP_domain}food/getMenuItemData.php`;
    let fData = new FormData();
    axios
      .post(url, fData)
      .then((response) => {
        setMenuItems(response.data);
        // Initialize quantity array for each item
        const newQty = new Array(response.data.length).fill(1);
        setMenuqty(newQty);
        setSpinner(0);
      })
      .catch(error => {
        toast.error(error, " Try Again...!");
        setSpinner(0);
      });
  };

  // Increase quantity
  const increaseQuantity = (index) => {
    setMenuqty(prevMenuqty => {
      const updatedMenuqty = [...prevMenuqty];
      updatedMenuqty[index] += 1;
      return updatedMenuqty;
    });
  };

  // Decrease quantity but not below 1
  const decreaseQuantity = (index) => {
    setMenuqty(prevMenuqty => {
      const updatedMenuqty = [...prevMenuqty];
      if (updatedMenuqty[index] > 1) {
        updatedMenuqty[index] -= 1;
      }
      return updatedMenuqty;
    });
  };

  // Add to cart function
  const addtoCartfromrecomended = (item, index) => {
    addToCart(item.item_id, item.name, menuqty[index], item.price);
  };

  useEffect(() => {
    getMenuItemData();
  }, []);

  ////////////// Speech Recognition & Synthesis ////////////////////
  const synth = window.speechSynthesis;
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  // eslint-disable-next-line
  const [currentOrder, setCurrentOrder] = useState({ itemId: "", qty: 0 });
  const [add, setadd] = useState({itemId:0,itemName:'',itemPrice:0,qty:1});


  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const newRecognition = new window.webkitSpeechRecognition();
      // Default configuration; we'll reset event handlers on each start.
      newRecognition.continuous = false;
      newRecognition.interimResults = false;
      newRecognition.lang = "en-IN";
      newRecognition.maxAlternatives = 1;
      setRecognition(newRecognition);
    } else {
      alert("Your browser does not support speech recognition. Please use Chrome.");
    }
  }, []);

  // Helper: Speak text then execute callback after a short delay
  const speakWithCallback = (text, voiceLang, callback) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    let indianVoice = voices.find((voice) => voice.lang === voiceLang);
    if (indianVoice) utterance.voice = indianVoice;
    utterance.onend = () => {
      // Adding a short delay to ensure the mic is ready
      setTimeout(() => {
        if (callback) callback();
      }, 100);
    };
    synth.speak(utterance);
  };


  // Start ordering process
  const startOrdering = () => {
    if (isListening) return;

    speakWithCallback("Hello! What would you like to add in cart?", "hi-IN", () => {
      startSpeechRecognition("order");
    });
  };

  // Reset and start speech recognition for a given type (order, quantity, confirmation)
  const startSpeechRecognition = (type) => {
    if (!recognition) return;

    // Abort any current recognition and reset the flag
    if (isListening) {
      recognition.abort();
      startSpeechRecognition(type);
      return;
    }

    setIsListening(true);
    let speechDetected = false;
    let errorHandled = false;

    // **Reset event handlers to avoid duplicates**
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onspeechend = null;
    recognition.onend = null;

    recognition.onresult = (event) => {
      speechDetected = true;
      const result = event.results[0][0].transcript.trim();

      if (type === "order") handleOrder(result);
      else if (type === "quantity") handleQuantity(result);
      else if (type === "confirmation") handleConfirmation(result);
      else if (type === 'iteamconfirmation') handleConfirmationofitem(result);
    };

    recognition.onerror = (event) => {

      setIsListening(false);
      if (event.error === "no-speech") {
        errorHandled = true;
        speakWithCallback("I didn't hear anything. Please try again.", "hi-IN", () => {
          startSpeechRecognition(type);
        });
      } else {
        speakWithCallback("Sorry, there was an error. Please try again.", "hi-IN");
        window.location.reload();
      }
    };

    recognition.onspeechend = () => {
      // Stop recognition when speech ends
      recognition.stop();
    };

    recognition.onend = () => {
      setIsListening(false);
      // Only retry if no speech was detected and error was not already handled.
      if (!speechDetected && !errorHandled) {
        speakWithCallback("I didn't hear anything. Please try again.", "hi-IN", () => {
          startSpeechRecognition(type);
        });
      }
    };

    // Start listening
    recognition.start();
  };

  // Handle order input (item name)
  // Handle order input (item name)
  const handleOrder = (order) => {

    setCurrentOrder((prev) => ({ ...prev, itemId: order }));
    speakWithCallback(`wait... i am checking the item`, "hi-IN");
  
    const url = `${process.env.REACT_APP_domain}food/user/checkTheItem.php`;
    const formData = new FormData();
    console.log(order);
    formData.append('product_name', order);
    axios.post(url, formData)
      .then((response) => {
         console.log(response.data);
         setadd(prevState => ({
          ...prevState,
           itemPrice:response.data.price,
           itemName:response.data.name,
           itemId:response.data.item_id
        }));
        speakWithCallback(`You want ${response.data.name}.and the item Price is ${response.data.price} Rupees Is this correct? Say Yes correct, or No Incorrect.`, "hi-IN", () => {
          startSpeechRecognition('iteamconfirmation');
        });
      })
      .catch(error => {
        toast.error(error, " Try Again...!");
        setSpinner(0);
      });
  
  };

  // Handle confirmation input
  const handleConfirmationofitem = (iteamconfirmation) => {

    const lowerConfirm = iteamconfirmation.trim().toLowerCase();
    if (["yes", "correctt"].some(word => lowerConfirm.includes(word))) {


      speakWithCallback(`okay. How much quantity would you like to add?`, "hi-IN", () => {
        startSpeechRecognition("quantity");
      });
    } else if (lowerConfirm.includes("no")) {
      setCurrentOrder(prevOrder => ({
        ...prevOrder,
        itemId: ""
      }));

      speakWithCallback("Okay, let's try again. What would you like to add in cart?", "hi-IN", () => {
        startSpeechRecognition("order");
      });
    } else {

      speakWithCallback("Sorry, I didn't understand that. Please say Yes correct, or No Incorrect.", "hi-IN", () => {

        startSpeechRecognition("iteamconfirmation");

      });
    }
  };


  // Handle quantity input
  const handleQuantity = (quantity) => {
    let cleanText = quantity.trim().toLowerCase();
    const words = cleanText.split(/\s+/);
    let lastWord = words[words.length - 1];
    let number = parseInt(lastWord, 10);

    if (isNaN(number)) {
      const numberWords = {
        "one": 1,
        "two": 2,
        "three": 3,
        "four": 4,
        "five": 5,
        "six": 6,
        "seven": 7,
        "eight": 8,
        "nine": 9,
        "ten": 10
      };
      if (numberWords.hasOwnProperty(lastWord)) {
        number = numberWords[lastWord];
      }
    }

    if (!isNaN(number) && number > 0) {
      setCurrentOrder((prev) => {
        const updatedOrder = { ...prev, qty: number };


        speakWithCallback(
          `You want to add ${number} of ${updatedOrder.itemId}. Do you want to confirm? Say yes confirm or no cancel.`,
          "hi-IN",
          () => {
            // Update `add` only after confirmation
            setadd(prevState => ({
              ...prevState,
              qty:number // Update only itemName
            }));
            
            startSpeechRecognition("confirmation");
          }
        );
        return updatedOrder;
      });
    } else {
      speakWithCallback("I didn't understand the quantity. Please say a number.", "hi-IN", () => {
        startSpeechRecognition("quantity");
      });
    }
  };

  const [isconfirm, setisconferm] = useState(0);
  useEffect(() => {
    if (isconfirm) {
      speakWithCallback(`Successfully added ${add.qty} Qantity of ${add.itemId} In your cart.`, "hi-IN");
      addToCart(add.itemId, add.itemName, add.qty, add.itemPrice);
     
      setisconferm(0);
      setIsStarted(0);
    }
    // eslint-disable-next-line
  }, [isconfirm]);

  const handleConfirmation = (confirmation) => {
    const lowerConfirm = confirmation.trim().toLowerCase();
    if (["yes", "confirm"].some(word => lowerConfirm.includes(word))) {
      setisconferm(1);
    } else if (["no", "cancel"].some(word => lowerConfirm.includes(word))) {

      speakWithCallback("Okay, let's try again. What would you like to add in cart?", "hi-IN", () => {
        startSpeechRecognition("order");
        setisconferm(0);
      });
    } else {

      speakWithCallback("Sorry, I didn't understand that. Please say Yes Confirm or No cancel.", "hi-IN", () => {
        setisconferm(0);
        startSpeechRecognition("confirmation");

      });
    }
  };





  /////////////////////////////////////////////////////////////////

  return (
    <div className='mt-[65px]'>
      {/* Loading Spinner */}
      <div
        role="status"
        className={`${spinner ? "block" : "hidden"} z-[200] absolute inset-0 flex lg:ml-[15%] items-center justify-center`}
      >
        <svg
          aria-hidden="true"
          className="w-[60px] h-[60px] text-gray-200 animate-spin dark:text-gray-600 fill-blue-900"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
      {
        isBlind ? <button
          onClick={() => { !isStrted && startOrdering(); setIsStarted(1) }}
          onDoubleClick={() => { window.location.reload() }}
          className="start w-[300px] h-[300px] bg-green-500 text-white text-8xl pb-5 rounded-full 
             fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          Start
        </button> :
          ''
      }

      {/* Menu Items */}
      <div className="container mx-auto py-8 px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">All Menu</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-8 lg:gap-10">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="bg-white p-1 md:p-6 rounded-xl shadow-lg flex flex-col justify-between transform transition cursor-pointer"
            >
              <img
                src={`https://darkslategray-lion-860323.hostingersite.com/food/menuitemimg/${item.image_url}`}
                alt={item.name}
                className="w-full object-cover bg-white rounded-lg"
              />
              <h3 className="mt-1 text-xl font-semibold text-gray-700">{item.name}</h3>
              <h3 className="mt-1 text-xl font-semibold text-gray-700">Rs. {item.price}</h3>
              <div className="mt-auto">
                <div className="flex items-center justify-center mt-1">
                  <button onClick={() => decreaseQuantity(index)} className="text-white rounded-lg">
                    <GrFormSubtract style={{ color: 'white', background: 'red', borderRadius: '50%', width: '25px', height: '25px', fontWeight: 'bold' }} />
                  </button>
                  <span className="mx-2 text-lg font-semibold">{menuqty[index]}</span>
                  <button onClick={() => increaseQuantity(index)} className="text-white rounded-lg">
                    <FcPlus style={{ width: '30px', height: '30px' }} />
                  </button>
                </div>
                <button
                  onClick={() => addtoCartfromrecomended(item, index)}
                  className="mt-3 px-4 py-2 my-2 bg-blue-600 text-white rounded-lg w-fit"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recomended;
