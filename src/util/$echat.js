



/**个人倾向于选这个做对比
 * http://echarts.baidu.com/examples/editor.html?c=bar-y-category
 * series 为 不同类型：dnsTime、tcpTime 等
 * 
 */




let typeTime = Object.keys({
    "dnsTime": "0.00 ms",
    "tcpTime": "14.25 ms",
    "TTFB": "13.75 ms",
    "pageDownloadTime": "9.75 ms",
    "whiteScreenTime": "840.75 ms",
    "DOMReadyTime": "842.00 ms",
    "afterDOMReadyDownloadTime": "635.25 ms",
    "loadTime": "1.51 s",
})

const data = [{
    "dnsTime": "0.00 ms",
    "tcpTime": "42.75 ms",
    "TTFB": "5.50 ms",
    "pageDownloadTime": "5.50 ms",
    "whiteScreenTime": "966.50 ms",
    "DOMReadyTime": "967.00 ms",
    "afterDOMReadyDownloadTime": "1.25 ms",
    "loadTime": "967.75 ms",
    "description": {
        "createTime": "2018-06-06 02:44:34",
        "message": "hehe",
        "url": "http://taobao.com"
    }
}, {
    "dnsTime": "0.25 ms",
    "tcpTime": "8.25 ms",
    "TTFB": "10.75 ms",
    "pageDownloadTime": "8.50 ms",
    "whiteScreenTime": "584.75 ms",
    "DOMReadyTime": "592.75 ms",
    "afterDOMReadyDownloadTime": "85.00 ms",
    "loadTime": "671.75 ms",
    "description": {
        "createTime": "2018-06-06 02:45:07",
        "message": "hehe",
        "url": "http://baidu.com"
    }
}, {
    "dnsTime": "0.00 ms",
    "tcpTime": "14.25 ms",
    "TTFB": "13.75 ms",
    "pageDownloadTime": "9.75 ms",
    "whiteScreenTime": "840.75 ms",
    "DOMReadyTime": "842.00 ms",
    "afterDOMReadyDownloadTime": "635.25 ms",
    "loadTime": "1.51 s",
    "description": {
        "createTime": "2018-06-06 02:45:16",
        "message": "hehe",
        "url": "http://jd.com"
    }
}]
let newData = {}
/**
{
    taobao:[{dnsTime:''},...],
    jd:[{}],
}
*/
data.forEach(function(d){
    let { url,message } = d.description
    // let _url = url.split('.com')[0].split('http://')[1]
    // if( !_url ) _url = url.split('.com')[0].split('https://')[1]
    let _url = /^http(s)?:\/\/(\w*\.|^\s)*(.*?)\.(com|w*)/gm.exec(url)[3]
    console.log({_url})
    if(!newData.hasOwnProperty(_url)){
        newData[_url] = []
    }
    newData[_url].push(d)
})
console.log({newData})

/**
[{
    name: 'dnsTime',
    type: 'bar',
    data: [18203, 23489, 29034, 104970, 131744, 630230]
}]
*/
let convData = typeTime.map(function(d){
    let _data = []
    Object.keys(newData).forEach(function(oneType){
        // console.log('dd[d]:',newData[oneType])
        newData[oneType].forEach(function(oneDomain){
            // console.log(oneDomain[d])
            // _data.push(oneDomain[d].split(' ms')[0])
            const _group = /^(\d*\.\d*)(?:\s)(\w*)/.exec(oneDomain[d])
            let _time = _group[1]
            if(_group[2] == 's') {_time = _time * 1000}
            _data.push(_time)
        })
    })
    return {
        name:d,
        type:'bar',
        data:_data
    }
})
console.log(convData)


option = {
    title: {
        text: '网络对比',
        subtext: '数据来自Hiper'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: typeTime
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        type: 'category',
        data: Object.keys(newData)
    },
    series: convData
    // [
    //     {
    //         name: 'dnsTime',
    //         type: 'bar',
    //         data: [18203, 23489, 29034, 104970, 131744, 630230]
    //     },
    //     {
    //         name: '2012年',
    //         type: 'bar',
    //         data: [19325, 23438, 31000, 121594, 134141, 681807]
    //     }
    // ]
};



module.export = class{
    
}