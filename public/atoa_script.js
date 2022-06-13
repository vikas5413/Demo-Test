var shop_domain = get_shop()
var order_id = get_order_id()
var url = "https://34ba-112-196-88-154.in.ngrok.io"
if (order_id == '' || order_id == null || !order_id) {
    order_id = Shopify.checkout.order_id
}

document.getElementsByClassName('content')[0].style.display = 'none'
var original_title = document.title
document.title = 'atoa'

if (order_id != '' && shop_domain != '') {
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function (data) {
        if (xhttp.readyState === 4) {
            var response = JSON.parse(xhttp.response)

            if (response.status) {
                atoa_payment(
                    response.gateway,
                    response.financial_status,
                    order_id,
                    shop_domain
                )
            } else {
                document.getElementsByClassName('content')[0].style.display =
                    'block'
                document.title = original_title
            }
        }
    }

    xhttp.open(
        'GET',
        url + '/get-order/' +
            order_id +
            '/' +
            shop_domain,
        true
    )
    xhttp.send()
} else {
    document.getElementsByClassName('content')[0].style.display = 'block'
    document.title = original_title
}

function get_order_id() {
    var all_scripts = document.getElementsByTagName('script')
    for (var i = 0; i < all_scripts.length; i++) {
        var scripts_html = all_scripts[i].innerHTML
        var order_script = scripts_html.includes('order_id')
        if (order_script) {
            var split_scriptval = scripts_html.split(' = ')
            var script_obj = split_scriptval[1]
            order_id = ''
            var split_obj_val = script_obj.split(',')
            for (var j = 0; j < split_obj_val.length; j++) {
                var obj_val = split_obj_val[j].split(':')
                if (obj_val[0].replace(/["']/g, '') == 'order_id')
                    var order_id = obj_val[1]
            }
        }
    }
    return order_id
}

function get_shop() {
    var st_script = document.getElementById('__st').innerHTML
    var split_scriptval2 = st_script.split('=')
    var script_obj2 = split_scriptval2[1]
    var shop_name = ''
    var split_obj_val2 = script_obj2.split(',')
    for (var j = 0; j < split_obj_val2.length; j++) {
        var obj_val2 = split_obj_val2[j].split(':')
        if (obj_val2[0].replace(/["']/g, '') == 'pageurl')
            shop_name = obj_val2[1].replace(/["']/g, '')
    }
    var shop_domain = shop_name.split('/')
    shop_domain = shop_domain[0].replace(/\\/g, '')
    return shop_domain
}

function atoa_payment(payment_method, status, order_id, shop_domain) {
    if (payment_method.toLowerCase().includes('atoa') && status == 'pending') {
        var xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4) {
                var response = JSON.parse(xhttp.response)
                if (response.status == true) {
                    window.location =
                        url + '/processing/' +
                        order_id +
                        '/' +
                        shop_domain
                }
                if (response.status == false) {
                    document.getElementsByClassName(
                        'content'
                    )[0].style.display = 'block'
                    document.title = original_title
                }
            }
        }
        xhttp.open(
            'GET',
            url + '/processed/' + order_id,
            true
        )
        xhttp.send()
    } else {
        document.getElementsByClassName('content')[0].style.display = 'block'
        document.title = original_title
    }
}
