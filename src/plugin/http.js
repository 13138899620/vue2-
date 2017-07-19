/**
 * Created by v_lianwang on 2016/11/17.
 */

import axios from "axios"

axios.install = install

function install(Vue) {
    Object.defineProperties(Vue.prototype, {
        $http: {
            get() {
                return axios
            }
        }
    })
}


axios.defaults.baseURL = '/api/'
axios.interceptors.request.use(function(request) {
        if (request.method == "post") {
            var data = request.data;
            var str = "";
            for (var item in data) {
                str += item + "=" + data[item] + "&";
            }
            request.data = str.substring(0, str.length - 1);
        }
        return request
    },
    function(err) {
        return Promise.reject(error);
    })

axios.interceptors.response.use(function(response) {
    return response;
}, function(error) {

    return Promise.reject(error);
});

export default axios