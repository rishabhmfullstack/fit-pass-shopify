// ----------------fitpass-banner.liquid start------------------
document.addEventListener('DOMContentLoaded', () => {
    const main_btn = document.querySelector('#fitneessId');
  
    if (!main_btn) {
      console.log('Button not found');
      return;
    }
  
    main_btn.addEventListener('click', async () => {
      main_btn.classList.add('loading');
  
      const popup = document.getElementById("apiPopup");
      const popupMessage = document.getElementById("apiMessage");
      const popupClose = document.querySelector(".popup-close");

    //   {% comment %} api call here {% endcomment %}
    
      try {
        const response = await fetch('https://services.fitpass.dev/cred/order-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-FITPASS-PAYLOAD': JSON.stringify({
              user_id: 191919193174,
              fitpass_id: 98765789,
              app_version: '8.1.2',
              device_os: '15',
              device_id: '45231',
              device_type: 'android',
              device_name: 'android',
              access_source: 'customer-android-app',
              customer_mobile: '9212613245',
              customer_name: 'Testing',
            }),
            'X-FITPASS-APP-KEY': 'fhskjdhfkjsdahgkjadsfmgbasdiughdiag',
            'X-AUTH-TOKEN': 'l9xGmxeF6GU4djgsMDBWG9ui0xeDhvR7qxbWq1M9',
          },
          body: JSON.stringify({
            latitude: 28.6327,
            longitude: 77.2198,
            merchant_transaction_number: 'TXN-191919193174-1763126888',
          }),
        });
  
        const data = await response.json();
  
        // Show popup with API Response
        let errorMsg = data?.meta?.description || "Unknown error";
  
        popupMessage.textContent = errorMsg;
        popup.style.display = "flex";
  
        popupClose.addEventListener("click", () => {
          popup.style.display = "none";
        });
  
        popupClose.addEventListener("click", () => {
          popup.style.display = "none";
        });
  
      } catch (err) {
        // Catch network / unexpected errors safely
        popupMessage.textContent = err.message || "Unexpected error";
        popup.style.display = "flex";
      }
  
      main_btn.classList.remove('loading');
    });
  });

// ----------------fitpass-banner.liquid end--------------------

// -----------------free-trial-plan.liquid start ----------------

document.addEventListener("DOMContentLoaded", () => {
    const freeId = document.querySelector("#freeId");

    if (!freeId) {
      console.log("Button not found");
      return;
    }

    const popup = document.getElementById("apiPopup");
    const popupMessage = document.getElementById("apiMessage");
    const popupClose = document.querySelector(".popup-close");


    freeId.addEventListener("click", async () => {
      freeId.classList.add("loading");
      try {
        const response = await fetch("https://services.fitpass.dev/cred/pending-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-FITPASS-PAYLOAD": JSON.stringify({
              user_id: 191919193173,
              fitpass_id: 98765783,
              app_version: "8.1.2",
              device_os: "15",
              device_id: "45231",
              device_type: "android",
              device_name: "android",
              access_source: "customer-android-app",
              customer_mobile: "9212613245",
              customer_name: "Testing"
            }),
            "X-FITPASS-APP-KEY": "fhskjdhfkjsdahgkjadsfmgbasdiughdiag",
            "X-AUTH-TOKEN": "l9xGmxeF6GU4djgsMDBWG9ui0xeDhvR7qxbWq1M9"
          },
          body: JSON.stringify({
            product_type: 22,
            after_discount_price: 2199,
            total_order_price: 5330,
            membership_plan_ids: [5305],
            geo_location: { lat: 28.682875, long: 77.200337 },
            sale_discount: 3131,
            coupon_discount_details: { coupon_code: "" },
            redeemable_amount: { fitcash: 0, "e-voucher": 0 },
            fitshop_product_details: null,
            corporate_id: 0,
            user_type: 1,
            user_source: [
              { key: "campaign_name", value: "cred-subscription-offer" },
              { key: "referral_source", value: "" },
              { key: "referral_channel", value: "" }
            ],
            device_details: {
              ip: "192.168.128.130",
              app_version: "5.3.4",
              init_channel: "App",
              device_id: "491DF849-E365-42A0-AC9C-43969FDB1DA3",
              device_name: "iPhone10,3",
              device_type: "iOS",
              device_os: "15.5",
              user_agent:
                "Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
            },
            redirect_url: "/cred-special-plan-payment",
            screen_source: "",
            theme: "",
            merchant_transaction_number: "",
            merchant_order_number: ""
          })
        });

        const data = await response.json();
        console.log("API Response:", data);

        // Show popup with API Response
      let errorMsg = data?.meta?.description || "Unknown error";

      popupMessage.textContent = errorMsg;
      popup.style.display = "flex";

      popupClose.addEventListener("click", () => {
        popup.style.display = "none";
      });

      popupClose.addEventListener("click", () => {
        popup.style.display = "none";
      });



        if (response.ok) {
          window.location.href = "/payment-getway";
        }
      } catch (err) {
        popupMessage.textContent = err.message || "Unexpected error";
        popup.style.display = "flex";
        console.error("API Error:", err);
      }
      freeId.classList.remove("loading");
    });
  });


//   {% comment %} PrevArrow {% endcomment %}
   const nextArrow = document.querySelector("#nextArrow");
   nextArrow.addEventListener("click", ()=> {
    window.location.href = "/";
  })


// -----------------free-trial-plan.liquid end ------------------



