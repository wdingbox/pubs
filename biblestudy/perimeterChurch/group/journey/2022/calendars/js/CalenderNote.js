
var CalenderNote = {
    gen_calendar: function (eid, iYearNext) {
        var today = new Date()
        var todayID = today.toLocal_YY_MM_DD()

        //var yr = prompt("enter year xxxx", );
        var yr = today.getUTCFullYear()
        yr += iYearNext

        var date = new Date(yr, 0, 1);
        //var yearEnd = new Date(2019, 11, 1);
        var trs = "", weekidx = 0, idaycounter = 0
        for (var i = 0; i <= 3650; i++) {
            var sdat = date.addDays(i);
            var iweek = sdat.getDay()
            var iyear = sdat.getUTCFullYear()
            var imont = 1 + sdat.getMonth()
            var idate = sdat.getDate()
            var sdateID = sdat.toLocal_YY_MM_DD()
            var contenteditable = ""
            if (sdateID < todayID) contenteditable = ""

            var special = "", ReservedDays = CalenderNote.gen_ReservedDates()
            if (ReservedDays[sdateID]) {
                ReservedDays[sdateID].forEach((desc) => {
                    special = `<a class='ReservedDesc' title='${desc}' href='${CalenderNote.Festival_Website[desc]}'>${desc.substr(0, 5)}</a><br>`
                })
            }

            if (idaycounter >= 364) break


            if (0 === iweek) {
                trs += `<tr><th class='thidx'>${++weekidx}<br><a class='month${imont} month_mark'>${imont}</a></th>`;
            }
            if (weekidx === 0) continue;
            idaycounter++

            trs += `<td class='month${imont}'><div class='sday' title=${sdateID}  iweek='${iweek}'>${idate}</div><div class='ReservedDay'>${special}</div><div id=${sdateID} title=${sdateID} class='notes' ${contenteditable}></div></td>`;

            if (6 === iweek) {
                trs += "</tr>";
            }
        }
        //$("#year").html(yr)
        $(`${eid} caption`).text(yr);
        $(`${eid} caption`).on("click", function () {
            $(this).parent().find("tbody").slideToggle()
        })
        $(`${eid} tbody`).html(trs)
            .find("td").on("click", function () {
                $(".hili_td").removeClass("hili_td")
                $(this).toggleClass("hili_td")
            })



        if (iYearNext != 0) return


        $(`#${todayID}`).each(function () {
            $(this).parent().find(".sday").addClass("today");
            //$(this)[0].scrollIntoView() //run in gen_calendar_end
        })
    }
    ,
    gen_calendar_end: function () {
        storage.input_load()
        storage.load2ui()

        uuti.import_DailyRecords_Obj(DailyRecords)

        $(".notes").on("keyup", function () {
            storage.save_notes()
        })

        //set notes width
        var width = $("td").width()
        $(".notes").css({ "width": width - 2 })

        //
        $(".notes").on("click", function (evt) {
            evt.stopImmediatePropagation()
            var _This = this
            var display = $("#editorboard").css("display")

            var bhasHili = $(this).hasClass("hili_notes")
            $(".hili_notes").removeClass("hili_notes")
            if (!bhasHili) {
                $(this).addClass("hili_notes")
            }
            bhasHili = $(this).hasClass("hili_notes")
            if (!bhasHili) {
                $("#editorboard").hide()
                return false
            }

            if ('none' == display && bhasHili) {
                $("#editorboard").show()
            } else {
                //$("#editxt").hide()
            }

            var sWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            var iweek = $(this).parent().index() - 1;


            var htm = $(this).html()
            $("#editxt").html(htm)
            $("#edishowdate").text($(this).attr("id") + ", " + sWeek[iweek])

            $("#editorboard")
                .css({
                    position: 'absolute',
                    xxleft: evt.pageX,
                    top: 20 + evt.pageY,
                    "margin-left": "auto",
                    "margin-right": "auto",
                    display: 'block'
                })
                .focus()

        })
        $(".sday").on("click", function () {
            $(this).toggleClass("hili_day")
        })




        ///////////////////////////////


        $("#editxt").off("keyup").on("keyup", function (evt) {
            if (evt.keyCode === 13) {
                // insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
                //document.execCommand('insertLineBreak', true, '<br/>');
                // prevent the default behaviour of return key pressed
                //return true;
            }
            var htms = $(this).html()
            var id = $("#edishowdate").text()
            $(`#${id}`).html(htms)
            storage.save_notes()
        })
        $("#editxt").on("blur", function () {
            var htms = $(this).html()
            var id = $("#edishowdate").text()
            $(`#${id}`).html(htms)
            storage.save_notes()

            $("#editorboard").hide()
        })
        $("#editxt").on("click", function (evt) {
            evt.stopImmediatePropagation()
            return false
        })

        var eid = "#tab1"
        var rect = $(eid)[0].getBoundingClientRect();
        var width = $(eid).width()
        $("#editorboard").css({
            "left": 30 + rect.left,
            "top": 1000,
            "width": width - 100
        })
        $("#editorboard").on("click", function () {
            $(this).hide()
        })
        $("body").on("click", function () {
            $("#editorboard").hide()
        })


        $("#ScrollToToday").on("click", function () {
            $(".today")[0].scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
        })



        /////////////////////////
        $("#menuPanelToggler").on("click", function () {
            $("#_MenuPanel").slideToggle()
        })
        $("#_MenuPanel").slideToggle()

        $("#info").on("click", function () {
            uuti.format_obj_txa()
        })

        $("#emailto").on("click", function () {
            var smail = $("#email_addr").val()
            var sbody = JSON.stringify(uuti.export_notes())
            var str = `mailto:${smail}?subject=https://bsnp21.github.io/tools/calendars/calendar3yr.htm&body=${encodeURIComponent(sbody)}`
            $(this).attr("href", str)

            storage.input_save()
        })


        ///


        setTimeout(function () {
            $(".today")[0].scrollIntoView()
        }, 500)

    }

    ,
    Festival_Website : {
        "Purim": "https://www.infoplease.com/culture-entertainment/holidays/what-purim",
        "Passover": "https://www.infoplease.com/encyclopedia/religion/judaism/info/passover",
        "Shavuot": "https://www.infoplease.com/encyclopedia/religion/judaism/info/shavuot",
        "RoshHashaah": "https://www.infoplease.com/culture-entertainment/holidays/rosh-hashanah-jewish-new-year",
        "YomKippur": "https://www.infoplease.com/culture-entertainment/holidays/what-yom-kippur",
        "Sukkot": "https://www.infoplease.com/encyclopedia/religion/judaism/info/tabernacles-feast-of",
        "ShemiiAtzeret": "https://www.infoplease.com/dictionary/shemini-atzereth"
    },
    gen_ReservedDates: function () {
        //https://www.infoplease.com/calendars/holidays/jewish-holidays
        //NOTE: All Hebrew holidays begin at sundown on the evening before the date given.


        var Jewish_Festival_Dates = {
            "10_02_28": "Purim",
            "10_03_30": "Passover",
            "10_05_19": "Shavuot",
            "10_09_9": "RoshHashaah",
            "10_09_18": "YomKippur",
            "10_09_23": "Sukkot",
            "10_09_30": "ShemiiAtzeret",
            "11_03_20": "Purim",
            "11_04_19": "Passover",
            "11_06_8": "Shavuot",
            "11_09_29": "RoshHashaah",
            "11_10_8": "YomKippur",
            "11_10_13": "Sukkot",
            "11_10_20": "ShemiiAtzeret",
            "12_03_8": "Purim",
            "12_04_7": "Passover",
            "12_05_27": "Shavuot",
            "12_09_17": "RoshHashaah",
            "12_09_26": "YomKippur",
            "12_10_1": "Sukkot",
            "12_10_8": "ShemiiAtzeret",
            "13_02_24": "Purim",
            "13_03_26": "Passover",
            "13_05_15": "Shavuot",
            "13_09_5": "RoshHashaah",
            "13_09_14": "YomKippur",
            "13_09_19": "Sukkot",
            "13_09_26": "ShemiiAtzeret",
            "14_03_16": "Purim",
            "14_04_15": "Passover",
            "14_06_4": "Shavuot",
            "14_09_25": "RoshHashaah",
            "14_10_4": "YomKippur",
            "14_10_9": "Sukkot",
            "14_10_16": "ShemiiAtzeret",
            "15_03_5": "Purim",
            "15_04_4": "Passover",
            "15_05_24": "Shavuot",
            "15_09_14": "RoshHashaah",
            "15_09_23": "YomKippur",
            "15_09_28": "Sukkot",
            "15_10_5": "ShemiiAtzeret",
            "16_03_24": "Purim",
            "16_04_23": "Passover",
            "16_06_12": "Shavuot",
            "16_10_3": "RoshHashaah",
            "16_10_12": "YomKippur",
            "16_10_17": "Sukkot",
            "16_10_24": "ShemiiAtzeret",
            "17_03_12": "Purim",
            "17_04_11": "Passover",
            "17_05_31": "Shavuot",
            "17_09_21": "RoshHashaah",
            "17_09_30": "YomKippur",
            "17_10_5": "Sukkot",
            "17_10_12": "ShemiiAtzeret",
            "18_03_1": "Purim",
            "18_03_31": "Passover",
            "18_05_20": "Shavuot",
            "18_09_10": "RoshHashaah",
            "18_09_19": "YomKippur",
            "18_09_24": "Sukkot",
            "18_10_1": "ShemiiAtzeret",
            "19_03_21": "Purim",
            "19_04_20": "Passover",
            "19_06_9": "Shavuot",
            "19_09_30": "RoshHashaah",
            "19_10_9": "YomKippur",
            "19_10_14": "Sukkot",
            "19_10_21": "ShemiiAtzeret",
            "20_03_10": "Purim",
            "20_04_9": "Passover",
            "20_05_29": "Shavuot",
            "20_09_19": "RoshHashaah",
            "20_09_28": "YomKippur",
            "20_10_3": "Sukkot",
            "20_10_10": "ShemiiAtzeret",
            "21_02_26": "Purim",
            "21_03_28": "Passover",
            "21_05_17": "Shavuot",
            "21_09_7": "RoshHashaah",
            "21_09_16": "YomKippur",
            "21_09_21": "Sukkot",
            "21_09_28": "ShemiiAtzeret",
            "22_03_17": "Purim",
            "22_04_16": "Passover",
            "22_06_5": "Shavuot",
            "22_09_26": "RoshHashaah",
            "22_10_5": "YomKippur",
            "22_10_10": "Sukkot",
            "22_10_17": "ShemiiAtzeret",
            "23_03_7": "Purim",
            "23_04_6": "Passover",
            "23_05_26": "Shavuot",
            "23_09_16": "RoshHashaah",
            "23_09_25": "YomKippur",
            "23_09_30": "Sukkot",
            "23_10_7": "ShemiiAtzeret",
            "24_03_24": "Purim",
            "24_04_23": "Passover",
            "24_06_12": "Shavuot",
            "24_10_3": "RoshHashaah",
            "24_10_12": "YomKippur",
            "24_10_17": "Sukkot",
            "24_10_24": "ShemiiAtzeret",
            "25_03_14": "Purim",
            "25_04_13": "Passover",
            "25_06_2": "Shavuot",
            "25_09_23": "RoshHashaah",
            "25_10_2": "YomKippur",
            "25_10_7": "Sukkot",
            "25_10_14": "ShemiiAtzeret",
            "26_03_3": "Purim",
            "26_04_2": "Passover",
            "26_05_22": "Shavuot",
            "26_09_12": "RoshHashaah",
            "26_09_21": "YomKippur",
            "26_09_26": "Sukkot",
            "26_10_3": "ShemiiAtzeret",
            "27_03_23": "Purim",
            "27_04_22": "Passover",
            "27_06_11": "Shavuot",
            "27_10_2": "RoshHashaah",
            "27_10_11": "YomKippur",
            "27_10_16": "Sukkot",
            "27_10_23": "ShemiiAtzeret",
            "28_03_12": "Purim",
            "28_04_11": "Passover",
            "28_05_31": "Shavuot",
            "28_09_21": "RoshHashaah",
            "28_09_30": "YomKippur",
            "28_10_5": "Sukkot",
            "28_10_12": "ShemiiAtzeret",
            "29_03_1": "Purim",
            "29_03_31": "Passover",
            "29_05_20": "Shavuot",
            "29_09_10": "RoshHashaah",
            "29_09_19": "YomKippur",
            "29_09_24": "Sukkot",
            "29_10_1": "ShemiiAtzeret",
            "30_03_19": "Purim",
            "30_04_18": "Passover",
            "30_06_7": "Shavuot",
            "30_09_28": "RoshHashaah",
            "30_10_7": "YomKippur",
            "30_10_12": "Sukkot",
            "30_10_19": "ShemiiAtzeret"
        }//Jewish_Festival_Dates



        var ReservedDays = {}
        for (let [sdate, desc] of Object.entries(Jewish_Festival_Dates)) {
            if (!ReservedDays[sdate]) ReservedDays[sdate] = []
            ReservedDays[sdate].push(desc)
        }
        return ReservedDays;
    }
}




Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
Date.prototype.toLocalY4MMDD = function () {
    var syear = this.getUTCFullYear().toString()
    var smonth = (1 + this.getMonth()).toString().padStart(2, "0")
    var sdate = this.getDate().toString().padStart(2, "0")
    return syear + smonth + sdate;
}
Date.prototype.toLocal_YY_MM_DD = function () {
    var syear = this.getUTCFullYear().toString().substr(2)
    var smonth = (1 + this.getMonth()).toString().padStart(2, "0")
    var sdate = this.getDate().toString().padStart(2, "0")
    return syear + "_" + smonth + "_" + sdate;
}




var storage = {
    save_notes: function () {
        var obj = uuti.export_notes()
        var str = JSON.stringify(obj)
        $("#info").text("size:" + str.length)
        localStorage.setItem("notes", str)
        var str = JSON.stringify(obj, null, 4)
        $("#outx").val(str)
    },
    load2ui: function () {
        var str = localStorage.getItem("notes")
        $("#outx").val(str)
        if (!str) return
        uuti.render2ui(str)
    },

    input_save: function () {
        var val = $("input").each(function () {
            var val = $(this).val()
            var id = $(this).attr("id")
            if (id) {
                localStorage.setItem(id, val)
            }
        })
    },
    input_load: function () {
        var val = $("input").each(function () {
            var id = $(this).attr("id")
            if (id) {
                var val = localStorage.getItem(id)
                $(this).val(val)
            }
        })
    },

}

var uuti = {
    export_notes: function () {
        var data = {}
        $(".notes").each(function () {
            var txt = $(this).html().trim()
            var sdate = $(this).attr("id")
            if (txt.length > 1 && txt != "<ol><li></li></ol>" && txt != "<ol type=\"a\"><li></li></ol>" && txt != "<ul><li></li></ul>") {
                data[sdate] = txt
            }
        })
        //var str = JSON.stringify(data, null, 4)
        return data
    },
    Clear: function () {
        if (confirm("Empty notes of Calendar?") == false) return
        $(".notes").html("")
        setTimeout(() => {
            if (confirm("Clear all notes data in local storage? (unrecoverable)") == false) return
            localStorage.setItem("notes", "")
        }, 1)
    },
    import_Notes: function () {
        var str = $("#outx").val().trim()
        if (str.length === 0 || str[0] !== "{") return alert("no data to table")
        uuti.render2ui(str)
    },
    render2ui: function (str) {
        var obj = JSON.parse(str)
        if (!obj) return alert("not obj:" + str)
        uuti.import_DailyRecords_Obj(obj)
    },
    import_DailyRecords_Obj: function (obj) {
        if (!obj) return alert("not obj:" + str)
        for (let [sdate, txt] of Object.entries(obj)) {
            $(`#${sdate}`).html(txt)
        }
    },
    Txa2uiCompare: function (str) {
        var uiObj = uuti.export_notes()
        var str = $("#outx").val().trim()
        var txObj = JSON.parse(str)
        if (!txObj) return alert("not obj:" + str)

        var allNotes = {}
        Object.keys(uiObj).forEach(key => allNotes[key] = 0)
        Object.keys(txObj).forEach(key => allNotes[key] = 0)

        var trs = ""
        Object.keys(allNotes).forEach(key => {
            var txt1 = uiObj[key], txt2 = txObj[key]
            if (!txt1) txt1 = " "
            if (!txt2) txt2 = " "
            if (txt1 !== txt2) {
                trs += `<tr><td>${key}</td><td><div class='cmpitm itm1'>${txt2}</div></td><td><div class='cmpitm itm2'>${txt1}</div></td></tr>`
            }
        })
        if (trs.length === 0) return alert("identical")
        $("#cmp").html(`<table border='1' class='cmp'><thead><tr><th>date</th><th>tx</th><th>ca</th></tr></thead><tbody>${trs}</tbody></table>`)
        $(".cmpitm").on("click", function () {
            $(this).toggleClass("Hili_cmp")
            var id = $(this).parentsUntil("tbody").find("td:eq(0)").text()
            var txt = $(this).html()
            $(`#${id}`).html(txt)
            storage.save_notes()
        })
    },

    increase_width: function (idlta) {
        var width = $("#tab1 td").width();
        width += idlta
        $("td").width(width)
        $(".notes").css({ "width": width })
    },

    format_obj_txa: function () {
        var val = $("#outx").val()
        if (!val) return
        var obj = JSON.parse(val)
        var str = JSON.stringify(obj, null, 4)
        $("#outx").val(str)

        var w = $("#outx").width(), h = $("#outx").height()
        w = (w >= 500) ? 300 : 510, h = (h >= 500) ? 50 : 510
        $("#outx").css({ width: w, height: h })
    },


}
