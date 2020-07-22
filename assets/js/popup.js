var zubizi = {

    copyToClipboard: function (selector) {
        /* Get the text field */
        var copyText = $(selector).html();

        /* Select the text field */
        copyText.select();

        /* Copy the text inside the text field */
        document.execCommand("copy");

        /* Alert the copied text */
        alert("Copied the text: " + copyText.value);
    },

    parseMobileForJD: function (div) {
        var numbers_enc = {
            "mobilesv icon-dc": "", // +
            "mobilesv icon-fe": "", // (
            "mobilesv icon-hg": "", // )
            "mobilesv icon-ba": "", // <space> 
            "mobilesv icon-yz": "1",
            "mobilesv icon-wx": "2",
            "mobilesv icon-vu": "3",
            "mobilesv icon-ts": "4",
            "mobilesv icon-rq": "5",
            "mobilesv icon-po": "6",
            "mobilesv icon-nm": "7",
            "mobilesv icon-lk": "8",
            "mobilesv icon-ji": "9",
            "mobilesv icon-acb": "0",
        };



        var number = '';
        $(div).each(function () {
            $(this).find('span').each(function () {
                number += numbers_enc[$(this).attr('class')];
            });
        });
        return number;
    },

    getContentData: function (body) {
        var all = [];
        var self = this;
        $(body).find('.cntanr').each(function () {
            var that = $(this);
            var store = {};
            store.name = that.find('.lng_cont_name').text();
            store.title = that.find('.jcn>a').attr('title');
            store.short_addr = that.find('.cont_sw_addr').text();
            store.address = that.find('.cont_fl_addr').text();
            store.image = that.find('.altImgcls').attr('src');
            store.mobile = self.parseMobileForJD(that.find('.contact-info a')).substring(2, 99);

            all.push(store);
        });
        return {
            data: all
        };
    },

    getDataInCard: function (data) {

        var html = `<div class="container">
                    <div class="row">`;

        $.map(data.data, function (obj) {
            html += `<div class="col-md-6 mb-3">
                    <div class="card">
                        <div class="card-header font-weight-bold">${obj.name}</div>
                        <div class="card-body">
                            <div>
                                <small>
                                    ${obj.address}
                                </small>
                            </div>
                            <div>
                                <b>${obj.mobile}</b>
                            </div>
                        </div>
                    </div>
                </div>`;
        });

        html += `</div>
                </div>`;

        $('.all_nos').html(html);
    },

    getDataInTable: function (data) {
        $('.num_table').DataTable({
            data: data.data,
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
            columns: [
                {
                    title: "Image",
                    data: "image",
                    className: "px-1 align-middle",
                    render: function (data) {
                        return `<img src="${data}" width="100" />`;
                    }
                },
                {
                    title: "Name",
                    data: {
                        _: "name",
                        display: function (data) {
                            return `<span data-toggle="tooltip" title="${data.title}">${data.name}</span>`;
                        }
                    }
                },
                {
                    title: "Address",
                    className: "text-muted",
                    data: {
                        _: "address",
                        display: function (data) {
                            return `<small >${data.address}</small>`;
                        }
                    }
                },
                {
                    title: "Mobile",
                    data: "mobile"
                }
            ]
        });
    },

    modifyDOM: function () {
        return {
            html: document.body.innerHTML,
            domain: window.location.hostname
        };
    }
};

// console.log(window.location.hostname);

new ClipboardJS('.copy_table');


chrome.tabs.executeScript({
    code: '(' + zubizi.modifyDOM + ')();'
}, (results) => {
    if (results) {
        var tab_html = results[0].html;
        $('.page-title').html(`<h6 class="font-weight-bold">${$(tab_html).find('.gglsrc').text()}</h6>`);
        var data = zubizi.getContentData(tab_html);
        zubizi.getDataInTable(data);
    } else {
        $('.page-title').html('Nothing Found');
    } 

});

$(function () {
    $('body').tooltip({
        selector: '[data-toggle="tooltip"]'
    });
});