import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FcPlus } from "react-icons/fc";
import { GrFormSubtract } from "react-icons/gr";
import Cookies from 'js-cookie';
import Fuse from 'fuse.js';
import { useNavigate } from 'react-router-dom';
const Recomended = ({ addToCart, clearCart, cart }) => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [spinner, setSpinner] = useState(0);
  const [menuqty, setMenuqty] = useState([]);
  const [isStrted, setIsStarted] = useState(0);

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
  const [add, setadd] = useState({ itemId: 0, itemName: '', itemPrice: 0, qty: 1 });


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

  const start = () => {
    speakWithCallback("you want to listen the Operation List? say two times  ( yes or no )", "hi-IN", () => {
      startSpeechRecognition("skip");
    });
  }
  const handleSkip = (result) => {
    const lowerConfirm = result.trim().toLowerCase();
    if (["no", "incorrect"].some(word => lowerConfirm.includes(word))) {
      speakWithCallback("Please Tell me which operation you want to do?", "hi-IN", () => {
        startSpeechRecognition("operation");
      });
    }
    else if (["yes", "correct"].some(word => lowerConfirm.includes(word))) {
      SpeakMenuList();
    }
    else {
      speakWithCallback("I didn't hear anything. Please try again.", "hi-IN", () => {
        startSpeechRecognition('skip');
      });
    }
  }

  useEffect(()=>{
    if(parseInt(Cookies.get('isBlind'))){
      start();
    }
   // eslint-disable-next-line
  },[]);
  const operationsSayToUser = ['check menu items', 'add to cart', 'clear cart', 'check cart items', 'add address', 'Checkout', 'Order Status', 'exit'];
  const operations = ['check menu items', 'check menu item', 'check menu', 'add to cart', 'clear cart', 'check cart items', 'check cart details', 'cart details', 'add address', 'update address', 'change address', 'Checkout', 'Placeorder', 'place order', 'Order Status', 'Check Order Status', 'exit', 'stop'];

  const SpeakMenuList = () => {
    const speechtext = operationsSayToUser.map((item, index) => `${index + 1}! ${item} !! `).join(',');
    speakWithCallback(`${speechtext}. Please Tell me which operation you want to do?`, "eh-IN", () => {
      startSpeechRecognition("operation");
    });
  }
  const speakMenuItemsCategory = () => {
    const categories = [...new Set(menuItems.map(item => item.category))];
    let speechtext = [`Okay, We having the total ${categories.length} Category !`];
    
    categories.map(categorie => {
      speechtext = speechtext + `${categorie}!`;
      return 1;
    });
    speakWithCallback(`${speechtext}! Which category items you want to know?`, "hi-IN", () => {
      startSpeechRecognition('categoryformenu');
    });
  }
  const speakMenuItemsCategoryItems=(categoryToSpeak)=>{    
    let speechParts = [`Okay, The ${categoryToSpeak} Items Are `];
  
    // Filter items based on the selected category
    const filteredItems = menuItems.filter(item => item.category === categoryToSpeak);

    if (filteredItems.length === 0) {
      speechParts.push(`Sorry, no items found in the ${categoryToSpeak} category!`);
    } else {
      filteredItems.forEach(item => {
        speechParts.push(`${item.name}`);  // Hindi part
        speechParts.push(`Price is ${item.price}`); // English part
      });
    }


    // Function to speak text parts with different languages
    const speakInChunks = (parts, callback) => {
      const synth = window.speechSynthesis;
      let index = 0;

      const speakNext = () => {
        if (index < parts.length) {
          const utterance = new SpeechSynthesisUtterance(parts[index]);

          // Use Hindi for item names and English for prices
          if (parts[index].includes("Price is")) {
            utterance.lang = "en-US"; // English for prices
          } else {
            utterance.lang = "hi-IN"; // Hindi for item names
          }

          utterance.onend = () => {
            index++;
            speakNext(); // Move to the next part
          };

          synth.speak(utterance);
        } else if (callback) {
          callback(); // Call the callback after speaking all chunks
        }
      };

      speakNext();
    };

    // Speak filtered menu items in correct languages
    speakInChunks(speechParts, () => {
      startAddToCart();
    });
  }

  const speakTheMenuOfCategory = (cat) => {
    const categories = [...new Set(menuItems.map(item => item.category))];
    const options = {
      includeScore: true,
      threshold: 0.3,
    };
    const fuse = new Fuse(categories, options);
    const result = fuse.search(cat);
    if (result.map((res) => res.item)[0]) {
      speakMenuItemsCategoryItems(result.map((res) => res.item)[0]);
    }
    else {
      speakWithCallback(`Sorry Please Repeat Which category items you want to know?`, "hi-IN", () => {
        startSpeechRecognition('categoryformenu');
      });
    }

  }
  const handleOperation = (operation) => {

    const options = {
      includeScore: true,
      threshold: 0.3,
    };
    const fuse = new Fuse(operations, options);
    const result = fuse.search(operation);
   
    console.log("operation detected=>", result.map((res) => res.item)[0]);
    if (result.map((res) => res.item)[0] === 'check menu items' || result.map((res) => res.item)[0] === 'check menu item' || result.map((res) => res.item)[0] === 'check menu') {
      speakMenuItemsCategory();
    }
    else if (result.map((res) => res.item)[0] === 'add to cart') {
      console.log("adding to cart");
      startAddToCart();
    }
    else if (result.map((res) => res.item)[0] === 'check cart items' || result.map((res) => res.item)[0] === 'check cart details' || result.map((res) => res.item)[0] === 'cart details') {
      speakCartDetails();
    }
    else if (result.map((res) => res.item)[0] === 'add address' || result.map((res) => res.item)[0] === 'update address' || result.map((res) => res.item)[0] === 'change address') {
      speakWithCallback("okay.Tell Me Street or place name .", "hi-IN", () => {
        startSpeechRecognition('street');
      });
    }
    else if (result.map((res) => res.item)[0] === 'Checkout' || result.map((res) => res.item)[0] === 'place order' || result.map((res) => res.item)[0] === 'Placeorder') {
      speakWithCallback("Conferm To Place Order. say yes conferm no cancel  .", "hi-IN", () => {
        startSpeechRecognition('checkoutconferm');
      });
    }
    else if (result.map((res) => res.item)[0] === 'Order Status' || result.map((res) => res.item)[0] === 'Check Order Status') {
      speakWithCallback("How Much Last Orders Status You Want to Know. Like! (zero one!zero two).", "hi-IN", () => {
        startSpeechRecognition('checklastorderstatus');
      });
    }
    else if (result.map((res) => res.item)[0] === 'clear cart') {
      clearCart();
      speakWithCallback("Yes! the cart is Successfully cleared Now you can add the New item to card", "hi-IN", () => {
        start();
      });
    }
    else if (result.map((res) => res.item)[0] === 'exit' || result.map((res) => res.item)[0] === 'stop') {
      speakWithCallback("okay If you want anything, then click on center button.", "hi-IN", () => {
        setIsStarted(0);
      });
    }
    else {
      speakWithCallback("Sorry! I Don't Found Operation Please Say Correct Operation Name", "hi-IN", () => {
        startSpeechRecognition("operation");
      });
    }
  }
  // Start ordering process
  const startAddToCart = () => {
    if (isListening) return;
    speakWithCallback("What would you like to add in cart?", "hi-IN", () => {
      startSpeechRecognition("addToCart");
    });
  };

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const speakCartDetails = () => {
    if (cart.length === 0) {
      speakWithCallback("Sorry! Your Cart Is Empty, Add Something in Cart.", "hi-IN", () => {
        start();
      });
      return;
    }
    const itemsDescription = cart
      .map(item => `${item.qty}${item.name} ! price! ${item.price} rupees!`)
      .join(',');
    const totalDescription = `Total items:! ${totalItems}.! Total price:! ${totalPrice} rupees.!`;

    const speechText = `Your cart contains: ${itemsDescription}. ${totalDescription}`;
    speakWithCallback(`${speechText}`, "en-IN", () => {
      start();
    });
  };

  ////////////add address ///////
  const [address, setAddress] = useState({ street: '', city: '', state: '', postcode: '', country: '' });

  const updateStreet = (newStreet) => {
    setAddress(prevState => ({
      ...prevState,
      street: newStreet
    }));
    console.log(newStreet);
    speakWithCallback("okay. Now Tell Me City Name .", "hi-IN", () => {
      startSpeechRecognition('city');
    });
  };

  const updateCity = (newCity) => {
    setAddress(prevState => ({
      ...prevState,
      city: newCity
    }));
    speakWithCallback("okay. Now Tell Me State Name .", "hi-IN", () => {
      startSpeechRecognition('state');
    });
  };

  const updateState = (newState) => {
    setAddress(prevState => ({
      ...prevState,
      state: newState
    }));
    speakWithCallback("okay. Now Tell Me post code.", "hi-IN", () => {
      startSpeechRecognition('postcode');
    });
  };

  const updatePostcode = (newPostcode) => {
    setAddress(prevState => ({
      ...prevState,
      postcode: newPostcode
    }));
    speakWithCallback("okay. Now Tell Me Country Name .", "hi-IN", () => {
      startSpeechRecognition('country');

    });
  };

  const updateCountry = (newCountry) => {
    setAddress(prevState => ({
      ...prevState,
      country: newCountry
    }));
  };


  const handleSubmitAdressToSave = () => {
    const formData = ({
      firstname: Cookies.get('firstName'),
      lastname: Cookies.get('lastName'),
      email: Cookies.get('email'),
      street: address.street,
      city: address.city,
      state: address.state,
      postal_code: address.postcode,
      country: address.country,
      is_default: false,
    });
    console.log(formData.country);
    axios.post(`${process.env.REACT_APP_domain}food/user/Profile.php`, formData)
      .then((response) => {
        const APIResponse = response.data; // This is the response data from AXIOS
        toast.success(APIResponse.message || 'Success!'); // Safely access message in response
        console.log(APIResponse);
        setTimeout(() => {
           window.location.reload();
        }, 5000); 
      })
      .catch(error => {
        // Check if error is a response object (for HTTP errors), or a request/network error
        const errorMessage = error.response?.data?.message || error.message || 'Try Again...!';
        toast.error(errorMessage); // Pass a valid error message string to toast
        setSpinner(0); // Stop spinner on error
      });
  }
  function checkoutConferm(result) {
    const lowerConfirm = result.trim().toLowerCase();
    if (["yes", "confirm"].some(word => lowerConfirm.includes(word))) {
      speakWithCallback(` Wait! I am Placing Your Order.`, "hi-IN", () => {
        checkout();
      });
    } else if (["no", "cancel"].some(word => lowerConfirm.includes(word))) {
      speakWithCallback(`okay. The Order Place Is Cancel.`, "hi-IN", () => {
        window.location.reload();
      });
    }
  }
  const checkout = async () => {
    /// the same checkout fucntion is in App  components for simple people
    // Get user details from cookies
    const firstname = Cookies.get("firstName");
    const lastname = Cookies.get("lastName");
    const email = Cookies.get("email");

    // Check if values are available
    if (!firstname || !lastname || !email) {
      toast.error("User details not found!");
      speakWithCallback(`User details not found Please Login Repeat.`, "hi-IN", () => {
        Cookies.remove('email');
        Cookies.remove('userId');
        Cookies.remove('firstName');
        Cookies.remove('lastName');
        Cookies.remove('isBlind');
        Cookies.remove('isProfileSet');
        navigate('./');
        window.location.reload();
      });
      return;
    }

    if (cart?.reduce((acc, item) => acc + item.qty, 0)) {
      try {
        // Make the API request
        const response = await axios.post(`${process.env.REACT_APP_domain}food/user/addOrder.php`, {
          firstname,
          lastname,
          email
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        });

        console.log("Order Response:", response.data);

        if (response.data.success) {
          clearCart();
          const convertToText = (number) => {
            let result = number.toString().split('').map(num =>
              num === '0' ? 'zero' : num === '1' ? 'one' : num === '2' ? 'two' : num === '3' ? 'three' : num === '4' ? 'four' : num === '5' ? 'five' : num === '6' ? 'six' : num === '7' ? 'seven' : num === '8' ? 'eight' : num === '9' ? 'nine' : ''
            ).join(' ');
            return result;
          }
          toast.success(`Order placed successfully! Order eye-dee: ${response.data.order_id}! And You Have To Pay ${response.data.total_price},Rupees On Time OF Delivery`);
          speakWithCallback(`Order placed successfully! Order ID: ${convertToText(response.data.order_id)}! And You Have To Pay ${response.data.total_price},Rupees On Time OF Delivery`, "hi-IN", () => {
            start();
          });
        } else {
          toast.error(`Error: ${response.data.error}`);
          speakWithCallback(`Sorry! ${response.data.error}`, "hi-IN", () => {
            window.location.reload();
          });
        }
      } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
      }

    }
    else {
      speakWithCallback(`Sorry! Your Cart Is Empty Please Add Items In cart.}`, "hi-IN", () => {
        start();
      });
      toast.warning("Your Cart Is Empty, Please Add The items in cart.");
    }

  }

  const checkStatusOfLastOrders = (numbersoforders) => {

    const firstname = Cookies.get('firstName');
    const lastname = Cookies.get('lastName');
    const email = Cookies.get('email');
    let limit = parseInt(numbersoforders);
    if (limit <= 0) {
      limit = 2;
    }
    console.log(limit);
    if (!firstname || !lastname || !email) {
      speakWithCallback(`Sorry! Missing user information.`, "hi-IN", () => {
        window.location.reload();
      });
      return;
    }
    speakWithCallback(`Wait! I am Getting the Orders Details.}`, "hi-IN", async () => {
      try {
        // Make a POST request to the PHP API with the cookie data
        const response = await axios.post(`${process.env.REACT_APP_domain}food/user/getOrdersDetail.php`, {
          firstname,
          lastname,
          email,
          limit
        });

        // Log the response and update the state with orders
        console.log('API Response:', response.data);

        if (response.data.success) {
          console.log(response.data.orders); // Assuming orders are in the "orders" field

          let speechTextChunks = [];
          const convertToText = (number) => {
            return number.toString().split('').map(num =>
              num === '0' ? 'zero' : num === '1' ? 'one' : num === '2' ? 'two' :
              num === '3' ? 'three' : num === '4' ? 'four' : num === '5' ? 'five' :
              num === '6' ? 'six' : num === '7' ? 'seven' : num === '8' ? 'eight' :
              num === '9' ? 'nine' : ''
            ).join(' ');
          };
          
          // Group orders into chunks of 2 to avoid long speech
          const chunkSize = 2;
          let chunk = [];
          response.data.orders.forEach((order, index) => {
            let orderSpeech = `Order ID: ${convertToText(order.order_id)}. Status: ${order.status}. Total Price ₹${order.total_price}. `;
            chunk.push(orderSpeech);
          
            if ((index + 1) % chunkSize === 0 || index === response.data.orders.length - 1) {
              speechTextChunks.push(chunk.join(" "));
              chunk = [];
            }
          });
          
          // Function to speak each chunk sequentially
          const speakChunksSequentially = (index = 0) => {
            if (index < speechTextChunks.length) {
              speakWithCallback(speechTextChunks[index], "hi-IN", () => {
                speakChunksSequentially(index + 1);
              });
            } else {
              start(); // Restart after speaking all chunks
            }
          };
          
          // Start speaking
          speakChunksSequentially();
        } else {

        }
      } catch (error) {
        console.error('Error fetching user orders:', error);
      }
    });

  };



  useEffect(() => {
    if (address.country.length > 0 && address.city.length > 0 && address.state.length > 0 && address.street.length > 0 && address.postcode.length > 0) {
      const spacedPostalCode = address.postcode
        .toString()
        .split("")
        .map(char => (char === '0' ? 'zero' : char === '1' ? 'one' : char === '2' ? 'two' : char === '3' ? 'three' : char === '4' ? 'four' : char === '5' ? 'five' : char === '6' ? 'six' : char === '7' ? 'seven' : char === '8' ? 'eight' : char === '9' ? 'nine' : char)) // Replace '0' with 'zero'
        .join("");

      const addressSpeech = `Street, ${address.street}! City, ${address.city}! State, ${address.state}! Postal Code, ${spacedPostalCode}! Country, ${address.country}`;
      handleSubmitAdressToSave();
      setAddress({ street: '', city: '', state: '', postcode: '', country: '' });
      speakWithCallback(`Okay Fine. Check once if the address is correct. ${addressSpeech}! Addresse Saved Successfull".`, "hi-IN", () => {
         
      });

    }

    // eslint-disable-next-line
  }, [address]);








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

      if (type === "addToCart") handleAddToCart(result);
      else if (type === "quantity") handleQuantity(result);
      else if (type === "confirmation") handleConfirmation(result);
      else if (type === 'iteamconfirmation') handleConfirmationofitem(result);
      else if (type === 'operation') handleOperation(result);
      else if (type === 'skip') handleSkip(result);
      else if (type === 'street') updateStreet(result);
      else if (type === 'city') updateCity(result);
      else if (type === 'state') updateState(result);
      else if (type === 'postcode') updatePostcode(result);
      else if (type === 'country') updateCountry(result);
      else if (type === 'checkoutconferm') checkoutConferm(result);
      else if (type === 'checklastorderstatus') checkStatusOfLastOrders(result);
      else if (type === 'categoryformenu') speakTheMenuOfCategory(result);
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
  const handleAddToCart = (item) => {

    setCurrentOrder((prev) => ({ ...prev, itemId: item }));
    speakWithCallback(`wait... i am checking the item it takes few seconds`, "hi-IN");

    const url = `${process.env.REACT_APP_domain}food/user/checkTheItem.php`;
    const formData = new FormData();
    console.log(item);
    formData.append('product_name', item);
    axios.post(url, formData)
      .then((response) => {
        console.log(response.data);
        setadd(prevState => ({
          ...prevState,
          itemPrice: response.data.price,
          itemName: response.data.name,
          itemId: response.data.item_id
        }));
        if (response.data.error === 'No matching item found') {
          speakWithCallback(`Sorry! the Item ${item} is not found so Say correct item name or try another.`, "hi-IN", () => {
            speakWithCallback(`What would you want to add to cart.`, "hi-IN", () => {
              startSpeechRecognition("addToCart");
              setisconferm(0);
            });
          });
        }
        else {
          speakWithCallback(`You want ${response.data.name} and the item Price is ${response.data.price} Rupees Is this correct? Say Yes right, or No wrong.`, "hi-IN", () => {
            startSpeechRecognition('iteamconfirmation');
          });
        }
      })
      .catch(error => {
        toast.error(error, " Try Again...!");
        setSpinner(0);
      });

  };

  // Handle confirmation input
  const handleConfirmationofitem = (iteamconfirmation) => {

    const lowerConfirm = iteamconfirmation.trim().toLowerCase();
    if (["yes", "right"].some(word => lowerConfirm.includes(word))) {
      speakWithCallback(`okay. How much quantity would you like to add?`, "hi-IN", () => {
        startSpeechRecognition("quantity");
      });
    } else if (["no", "wrong"].some(word => lowerConfirm.includes(word))) {
      setCurrentOrder(prevOrder => ({
        ...prevOrder,
        itemId: ""
      }));

      speakWithCallback("Okay, let's try again. What would you like to add in cart?", "hi-IN", () => {
        startSpeechRecognition("addToCart");
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
          `You want to add ${number} of ${updatedOrder.itemId} Do you want to confirm? Say yes confirm or no cancel.`,
          "hi-IN",
          () => {
            // Update `add` only after confirmation
            setadd(prevState => ({
              ...prevState,
              qty: number // Update only itemName
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
      speakWithCallback(`Successfully added ${add.qty} Qantity of ${add.itemName} In your cart.`, "hi-IN");
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
        parseInt(Cookies.get('isBlind')) ? <button
          onClick={() => {
            if (!isStrted) {
              start();
              setIsStarted(1);
            }
          }}

          className="start w-[300px] h-[300px] bg-green-500 text-white text-8xl pb-5 rounded-full 
             fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          Start
        </button> :
          <></>
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
                src={`${process.env.REACT_APP_domain}food/menuitemimg/${item.image_url}`}
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
