// alert("hello world");

// let userData = {};

// document.querySelector(".reg-form").addEventListener("submit", async (e) => {
//   e.preventDefault();
// });
// const handleRegister = async (e) => {
//   userData[`${e.name}`] = e.value;
//   console.log(userData);
// };

// const handleSubmit = async () => {
//   //   let data = userData;
//   //   await fetch("/users/signup", {
//   //     credentials: "include",
//   //     body: data,
//   //   });

//   console.log(userData);
// };

let data = {};
let updataData = {};
let newBook = {};
// console.log(process.env);

document?.querySelector("#reg-form").addEventListener("submit", async (e) => {
  e.preventDefault();
});
document?.querySelector("#login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
});
alert("hello");

// form?.addEventListener("submit", async (e) => {
//   console.log("sumited");
//   e.preventDefault();

//   // e.stopPropagation();
//   //validate input
//   // send to backend

//   let urlPath = window.location.pathname;

//   if (urlPath == "/login") {
//     //login
//     try {
//       //registration
//       let respose = await fetch("/users/login", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       try {
//         const { code, message, user } = await respose.json();
//         //set cookie / authorisation
//         // console.log(code, message, user);

//         if (code == 200) {
//           localStorage.setItem("user", JSON.stringify(user));
//           location.replace("/user/dashboard");
//         }
//       } catch (error) {
//         window.alert(error.message);
//         window.location.replace("/login");
//         console.log(error);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   } else {
//     //registration
//     let respose = await fetch("/users/signup", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     try {
//       let data = await respose.json();

//       const { code, message, signature, Error } = data;
//       //   console.log(Error);
//       //   console.log(respose.text());
//       //set cookie / authorisation
//       if (Error) {
//         return alert(Error);
//       } else if (code == 201) {
//         window.localStorage.setItem("signature", signature);
//         //redirect to otp pager
//         window.location.replace("/otp");
//         window.alert(message);
//       } else {
//         window.alert(Error);
//       }
//     } catch (error) {
//       window.alert("error occured ");
//       console.log(code, message, signature, Error);
//     }
//   }
// });

async function handleUserRegister(e) {
  console.log(data);
  let respose = await fetch("/users/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  try {
    let data = await respose.json();

    const { code, message, signature, Error } = data;
    //   console.log(Error);
    //   console.log(respose.text());
    //set cookie / authorisation
    if (Error) {
      return alert(Error);
    } else if (code == 201) {
      window.localStorage.setItem("signature", signature);
      //redirect to otp pager
      window.location.replace("/otp");
      window.alert(message);
    } else {
      window.alert(Error);
    }
  } catch (error) {
    window.alert("error occured ");
    console.log(code, message, signature, Error);
  }
}

function handleChange(e) {
  data[`${e.name}`] = e.value;
  console.log(data);
}

async function handleOtpSubmit(e) {
  try {
    //verify OTP
    const signature = window.localStorage.getItem("signature");
    let respose = await fetch(`/users/verify/${signature}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    let R_data = await respose.json();
    const { Error, message } = R_data;
    if (Error) {
      return alert(Error);
    } else {
      alert(message);
      window.location.replace("/login");
    }
  } catch (error) {
    console.log("error ocured");
  }
}

async function handleLoginForm(e) {
  console.log(e);
  // try {
  //   console.log(data);
  //   let signature = localStorage.getItem("signature");
  //   console.log(signature);
  //   let response = await fetch("/users/login", {
  //     method: "POST",
  //     credentials: "include",
  //     headers: {
  //       "Content-Type": "application/json",
  //       authorization: signature,
  //     },
  //     body: JSON.stringify(data),
  //   });

  //   const { Error, message } = await response.json();
  //   if (Error) {
  //     alert(Error);
  //   } else {
  //     console.log("login");
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
}
