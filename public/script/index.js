// alert("hello world");

// let userData = {};

// document.querySelector(".reg-form").addEventListener("submit", async (e) => {
//   e.preventDefault();
// });
// const handleRegister = async (e) => {
//   userData[`&#x20A6; {e.name}`] = e.value;
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

let reg_form = document?.querySelector("#reg-form");
reg_form?.addEventListener("submit", async (e) => {
  e.preventDefault();
});
let login = document.querySelector(".login-form");
login?.addEventListener("submit", async (e) => {
  e.preventDefault();
});

async function handleUserRegister(e) {
  window.alert("account created successfully");
  window.location.replace("/login");
  // console.log(data);
  // let respose = await fetch("/users/signup", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // try {
  //   let data = await respose.json();

  //   const { code, message, signature, Error } = data;
  //   //   console.log(Error);
  //   //   console.log(respose.text());
  //   //set cookie / authorisation
  //   if (Error) {
  //     return alert(Error);
  //   } else if (code == 201) {
  //     window.localStorage.setItem("signature", signature);
  //     //redirect to otp pager
  //     window.location.replace("/otp");
  //     window.alert(message);
  //   } else {
  //     window.alert(Error);
  //   }
  // } catch (error) {
  //   window.alert("error occured ");
  //   console.log(code, message, signature, Error);
  // }
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
  try {
    let signature = localStorage.getItem("signature");
    console.log(signature);
    let response = await fetch("/users/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        authorization: signature,
      },
      body: JSON.stringify(data),
    });

    let res = await response.json();

    const { Error, role, message, email, accountType } = res;
    console.log(Error, message, accountType);
    if (Error) {
      alert(Error);
    } else {
      if (
        accountType == "Doctor" ||
        accountType == "Professionals" ||
        accountType == "doctor"
      ) {
        window.location.replace("/pro/doctor/dashboard");
      } else if (accountType == "admin") {
        window.location.replace("/admin/dashboard");
      } else if (accountType == "Pharmacy" || accountType == "pharmacy") {
        window.location.replace("/pharmacy/admin-dashboard");
      } else if (accountType == "phamacy") {
        window.location.replace("/phamacy/dashboard");
      }
      console.log("login", res);
    }
  } catch (error) {
    console.log(error);
  }
}
