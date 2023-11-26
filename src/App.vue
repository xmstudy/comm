<template>
  <div class="container">
    <header class="top">
      <span class="title">社区金库多签</span>
      <!-- 由web3 获取的当前用户第一个address -->
      <button class="address_btn">0x1234567987987</button>
    </header>
    <main class="body">
      <section class="card">
        <div class="card_title">
          <div class="name">金库转出</div>
          <div class="token_name">PSC</div>
        </div>
        <div class="transfer">
          <div
            class="name_select transfer_address"
            :class="{ active_transfer_address: isClickedTransfer }"
            @click="handlechange_isClickedTransfer"
          >
            选择接收地址
            <van-icon v-if="!isClickedTransfer" name="arrow-down" />
            <van-icon v-else name="arrow-up" />
          </div>
          <ul class="addressList" v-if="isClickedTransfer">
            <li>0x123456798712313</li>
            <li>0x3216549789875</li>
            <li>0x645649846516498</li>
            <li>0x321654613451611</li>
          </ul>
        </div>
        <div>
          <input placeholder="金额" v-model="amount" type="text" />
        </div>
        <button class="confirm" @click="handleAmountEvent">确认</button>
      </section>

      <section class="card">
        <div class="card_title">
          <div class="name">更换签名地址</div>
        </div>
        <div class="transfer">
          <div
            class="name_select transfer_address"
            :class="{ active_transfer_address: isClickedSign }"
            @click="handlechange_isClickedSign"
          >
            选择需要更换的签名地址
            <van-icon v-if="!isClickedSign" name="arrow-down" />
            <van-icon v-else name="arrow-up" />
          </div>
          <ul class="addressList" v-if="isClickedSign">
            <li v-for="item in 10" :key="item">签名地址{{ item }}</li>
          </ul>
        </div>
        <div>
          <input
            v-model="newSignAddress"
            placeholder="新签名地址"
            type="text"
          />
        </div>
        <button class="confirm" @click="handleAddressEvent">确认</button>
      </section>

      <section class="card" v-if="isAllConfirmed">
        <div class="card_title">
          <div class="name">签名信息</div>
        </div>
        <div class="sign_info" v-if="isAmount">
          <span>金额:{{ sendAmount }} </span>
          <span>接受地址:{{ confirmAddress }} </span>
          <span>已签人数:{{ curConfirmPerson }}/{{ totalConfirmPreson }} </span>
        </div>
        <div class="sign_info" v-else>
          <p>{{ OldAddress }}</p>
          <span>更换为</span>
          <p>{{ NewAddress }}</p>
          <span class="changeSignaddress"
            >已签人数:{{ curConfirmPerson }}/{{ totalConfirmPreson }}
          </span>
        </div>
        <button class="confirm" @click="handleConfirmEvent">确认</button>
      </section>
    </main>
    <!-- <button @click="transfer">转账</button> -->
  </div>
</template>

<script setup lang="ts">
// import { ethers } from "ethers";
import { ethers } from "ethers";
import { showFailToast } from "vant";
import { watch } from "vue";
import { ref } from "vue";
import { onMounted } from "vue";
// 输入的金额
const amount = ref();
const newSignAddress = ref("");
const isClickedTransfer = ref(false);
const isClickedSign = ref(false);
// 是否是转账事务
const isAmount = ref(false);
// 默认展示 签名信息
const isAllConfirmed = ref(true);
// 当前确认人数
const curConfirmPerson = ref(2);
// 总共确认人数
const totalConfirmPreson = ref(5);

const arrowUI = ref("");

const sendAmount = ref(1000);
const confirmAddress = ref("0x123456798");
const OldAddress = ref("0x老地址");
const NewAddress = ref("0x新地址");
onMounted(() => {
  initWeb3Account();
});
const initWeb3Account = () => {
  console.log(ethers);
  if (window.ethereum) {
    // 创建以太坊 provider
    let provider =
      window.ethereum != null
        ? new ethers.providers.Web3Provider(window.ethereum)
        : ethers.providers.getDefaultProvider();
    console.log("provider", provider);

    // const multicallObject = new Multicall({
    //   ethersProvider: provider,
    //   tryAggregate: true,
    // });

    // 请求用户授权
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts: string[]) => {
        // 用户已授权，accounts 是用户的以太坊账户数组
        console.log("Connected to Ethereum Wallet:", accounts);

        // 在这里可以执行其他与以太坊交互的操作
        // 例如：查询账户余额、发送交易等
        accountBalance(accounts[0]);
      })
      .catch((error: Error) => {
        console.error("Authorization failed:", error);
      });

    // 查询账户余额
    const accountBalance = (userAccount: string) => {
      provider
        .getBalance(userAccount)
        .then((balance) => {
          console.log("balance", balance);
          const balanceInEther = ethers.utils.formatEther(balance);
          console.log(`Account Balance: ${balanceInEther} ETH`);
        })
        .catch((balanceError) => {
          console.error("Failed to get account balance:", balanceError);
        });
    };
  } else {
    showFailToast(
      "Please install MetaMask or another Ethereum wallet extension."
    );
  }
};

const transfer = () => {
  // 构建一个交易对象
  const transaction = {
    to: "0xRecipientAddress", // 目标地址
    value: ethers.utils.parseEther("0.1"), // 发送 0.1 ETH
  };
  // 使用账户签署交易
  window.ethereum
    .request({ method: "eth_sendTransaction", params: [transaction] })
    .then((transactionHash: string) => {
      console.log("Transaction Sent. Transaction Hash:", transactionHash);
    })
    .catch((transactionError: Error) => {
      console.error("Failed to send transaction:", transactionError);
    });
};

const handlechange_isClickedTransfer = () => {
  isClickedTransfer.value = !isClickedTransfer.value;
};
const handlechange_isClickedSign = () => {
  isClickedSign.value = !isClickedSign.value;
};
watch(
  () => curConfirmPerson.value,
  (Nvalue) => {
    console.log(Nvalue);
    if (Nvalue == totalConfirmPreson.value) {
      console.log("发送事务");
      isAllConfirmed.value = false;
    }
  }
);

const handleAmountEvent = () => {
  console.log("发起事物，转账");
};
const handleAddressEvent = () => {
  console.log("发起事物，修改地址");
};
const handleConfirmEvent = () => {
  console.log("发起事物，确认");
};
</script>

<style scoped lang="less">
* {
  list-style: none;
}
.container {
  padding: 0.2rem 0.32rem 0;
  .top {
    // background-color: red;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    .title {
      font-size: 0.4rem;
    }
    .address_btn {
      background-color: #4a5364;
      border-radius: 10px;
      border: 2px solid #cad7f0;
      padding: 10px 16px;
      font-size: 16px;
      color: #fff;
    }
  }
  .body {
    .card {
      width: 100%;
      margin-bottom: 15px;
      border-radius: 15px;
      padding: 20px 15px;
      box-sizing: border-box;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      .card_title {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 20px;
        margin-bottom: 30px;
        color: #586070;
        font-weight: 600;
      }
      .sign_info {
        display: flex;
        flex-direction: column;
        color: #bdbdbd;
        span {
          margin: 5px 0;
        }
        p {
          margin: 0;
          color: #000;
        }
        .changeSignaddress {
          margin-top: 20px;
        }
      }
    }
  }

  input {
    box-sizing: border-box;
    outline: none;
    border: 2px solid #dde8ff;
    width: 100%;
    padding: 15px 10px;
    border-radius: 15px;
    margin-top: 20px;
    &:focus {
      border: 2px solid #000;
    }
    &::placeholder {
      color: #333;
      opacity: 0.6;
      font-size: 18px;
    }
  }
  .confirm {
    font-weight: 500;
    width: 100%;
    color: #fff;
    padding: 10px 0;
    background: #495364;
    color: #fff;
    font-size: 18px;
    border: none;
    outline: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 40px;
    border-radius: 10px;
  }
  .transfer {
    position: relative;
    .addressList {
  
      box-sizing: border-box;
      position: absolute;
      overflow-y: auto;
      width: 100%;
      height: 200%;
      padding: 15px;
      margin: 0;
      background-color: #fff;
      z-index: 1;
      border: 2px solid #dde8ff;
      border-top: 0;
      border-radius: 0 0 10px 10px;
    }
    .transfer_address {
      padding-left: 15px;
      color: #333;
      opacity: 0.6;
    }
  }
  .name_select {
    box-sizing: border-box;
    outline: none;
    border: 2px solid #dde8ff;
    width: 100%;
    padding: 15px 10px;
    border-radius: 15px;
    display: flex;
    justify-content: space-between;
    padding-right: 20px;
  }
}
.active_transfer_address {
  opacity: 1 !important;
  border-radius: 0 !important;
  border-bottom: none !important;
  border-radius: 10px 10px 0 0 !important;
  position: relative;
  &::after {
    content: "";
    width: 90%;
    height: 1px;
    background-color: #e7e7e7;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
