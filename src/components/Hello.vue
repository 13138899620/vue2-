<template>
  <div class="hello">
    <h1>消息队列</h1>
   
        <div class="content content_top_left">
            <h2>Client:A</h2>
            <div>
               <span>测试数据：</span> <input type="text" v-model="clientA_message"><button @click="SendMessage(clientA_Key,clientB,clientA_message)">发送消息</button>
            </div>
            <div class="content_list">
                <span>消息列表</span> <button style="margin-left:340px;" @click="ReceiveMessage(clientA_Key)">接收消息</button>
                <ul class="message_list">
                        <li class="message" v-show="!messageA">无</li>
                        <li class="message" v-show="messageA" v-for="(message,index) in messageA">{{index+1}}:发送者{{message.Sender}}，消息内容：{{message.Message}},发送时间:{{message.SendTime | formatDate}}</li>
                </ul>
            </div>
        </div>
        <div class="content content_top_right">
            <h2>Client:B</h2>
             <div>
               <span>测试数据：</span> <input type="text" v-model="clientB_message"><button @click="SendMessage(clientB_Key,clientA,clientB_message)">发送消息</button>
            </div>
             <div class="content_list">
                <span>消息列表</span><button style="margin-left:340px;" @click="ReceiveMessage(clientB_Key)">接收消息</button>
                <ul class="message_list">
                        <li class="message" v-show="!messageB">无</li>
                        <li class="message" v-show="messageB" v-for="(message,index) in messageB">{{index+1}}:发送者{{message.Sender}}，消息内容：{{message.Message}},发送时间:{{message.SendTime | formatDate}}</li>
                </ul>
            </div>
        </div>
        <div style="clear:both"></div>
       <div style="border:1px solid darkred;margin-top:40px;"></div>
       <div class="content content_bottom_left">
            <h2>系统列表</h2>
             <div>
                <table cellspacing="0" cellpadding="0">
                    <tr>
                        <th>Id</th>
                        <th>系统名称</th>
                        <th>系统Key</th>
                        <th>系统IP</th>
                    </tr>
                    <tr v-for="client in clients">
                        <td>{{client.ClientId}}</td>
                        <td>{{client.ClentName}}</td>
                        <td>{{client.Key}}</td>
                        <th>{{client.IP}}</th>
                    </tr>
                    
                    
                </table>
            </div>
        </div>
        <div class="content content_bottom_right">
            <h2>消息列表</h2>
             <div>
                <table cellspacing="0" cellpadding="0">
                    <tr>
                        <th style="width:6%">Id</th>
                        <th style="width:12%;">发送者</th>
                        <th style="width:12%;">接收者</th>
                        <th style="width:30%;">消息内容</th>
                        <th style="width:12%;">发送时间</th>
                        <th style="width:12%;">接收时间</th>
                        <th style="width:10%;">状态</th>
                    </tr>
                    <tr v-for="message in orderedMessages">
                        <td>{{message.MessageId}}</td>
                        <td>{{message.Sender}}</td>
                        <td>{{message.Receiver}}</td>
                        <td>{{message.Message}}</td>
                        <td>{{message.SendTime | formatDate}}</td>
                        <td>{{message.ReceiveTime | formatDate}}</td>
                        <td>{{message.Status | formatStatus}}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    var moment = require('moment');
    var _ = require('lodash');
    export default {
        name: 'hello',
        data() {
            return {
                clientA: "clientA",
                clientB: "clientB",
                clientA_Key: "123456",
                clientB_Key: "abcdef",
                clientA_message: "",
                clientB_message: "",
                clients: [],
                messages: [],
                messageA: null,
                messageB: null
            }
        },
        mounted() {
            this.getClients();
            this.getMessages();
        },
        computed: {
            orderedMessages: function() {
                return _.orderBy(this.messages, 'MessageId')
            }
        },
        methods: {
            SendMessage: function(clientKey, client, clientMessage) {
                if (clientMessage) {
                    this.$http.post("/Send", {
                        clientKey: clientKey,
                        receiver: client,
                        message: clientMessage
                    }).then((res) => {
                        alert(res.data.Data);
                        if (clientKey == this.clientA_Key) {
                            this.clientA_message = "";
                        } else if (clientKey == this.clientB_Key) {
                            this.clientB_message = "";
                        }
                        this.getMessages();
                    }).catch((error) => {
                        alert("出错了")
                    });
                } else {
                    alert("请输入消息内容");
                }
            },
            getClients: function() {
                this.$http.get("/GetAllClient").then((res) => {
                    this.clients = JSON.parse(res.data.Data);
                }).catch((error) => {
                    alert("出错了")
                });
            },
            getMessages: function() {
                this.$http.get("/GetAllMessage").then((res) => {
                    this.messages = JSON.parse(res.data.Data);
                }).catch((error) => {
                    alert("出错了")
                });
            },
            ReceiveMessage: function(clientKey) {
                this.$http.get("/Receive", {
                    params: {
                        clientKey: clientKey
                    }
                }).then((res) => {
                    let data = JSON.parse(res.data.Data);
                    if (clientKey == this.clientA_Key) {
                        this.messageA = data;
                    } else if (clientKey == this.clientB_Key) {
                        this.messageB = data;
                    }
                    this.getMessages();
                }).catch((error) => {
                    alert("出错了")
                });
            }
        },
        filters: {
            formatDate: function(value) {
                if (!value) return ''
                return moment(value).format("YYYY-MM-DD HH:mm:ss");
            },
            formatStatus: function(value) {
                if (value) return '已接收'
                return "未接收";
            }
        }
    }
</script>

<style scoped>
    h1, h2 {
        font-weight: normal;
    }
    
    ul {
        list-style-type: none;
        padding: 0;
        width: 52%;
        margin-left: 220px;
        text-align: left;
        height: 200px;
        background-color: #add9c0;
    }
    
    li {
        margin: 0 10px;
    }
    
    a {
        color: #42b983;
    }
    
    .content {
        width: 48%;
        display: inline-block;
    }
    
    .clear {
        float: none;
    }
    
    .content input {
        height: 20px;
        width: 300px;
    }
    
    button {
        margin-left: 20px;
        height: 26px;
    }
    
    .content_list {
        margin-top: 20px;
        margin-bottom: -26px;
    }
    
    .message {
        line-height: 26px;
        text-align: left;
        font-size: 14px;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
    }
    
    tr {
        text-align: center;
        width: 100%;
        height: 40px !important;
        padding: 0 !important;
    }
    
    th, td {
        border: solid #000 1px;
    }
    
    .content_top_left, .content_top_right {
        width: 48%;
        float: left;
    }
    
    .content_bottom_left {
        width: 30%;
    }
    
    .content_bottom_right {
        width: 68%;
    }
</style>