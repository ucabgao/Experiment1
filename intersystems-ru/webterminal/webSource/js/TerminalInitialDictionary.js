/**
 * Terminal dictionary object. Stores all defined keywords and rules for Caché language.
 */
var TerminalInitialDictionary = function () {

    /**
     * @type {Object}
     */
    this.KEYWORDS = {
        "break": 0, "catch": 0, "close": 0, "continue": 0, "do": 0, "d": 0, "else": 0,
        "elseif": 0, "for": 0, "goto": 0, "halt": 0, "hang": 0, "h": 0, "if": 0, "job": 0,
        "j": 0, "kill": 0, "k": 0, "lock": 0, "l": 0, "merge": 0, "new": 0, "open": 0, "quit": 0,
        "q": 0, "read": 0, "r": 0, "return": 0, "set": 0, "s": 0, "tcommit": 0, "throw": 0,
        "trollback": 0, "try": 0, "tstart": 0, "use": 0, "view": 0, "while": 0, "write": 0,
        "w": 0, "xecute": 0, "x": 0, "zkill": 0, "znspace": 0, "zn": 0, "ztrap": 0, "zwrite": 0,
        "zw": 0, "zzdump": 0, "zzwrite": 0, "print": 0, "zbreak": 0, "zinsert": 0, "zload": 0,
        "zprint": 0, "zremove": 0, "zsave": 0, "zzprint": 0, "mv": 0, "mvcall": 0, "mvcrt": 0,
        "mvdim": 0, "mvprint": 0, "zquit": 0, "zsync": 0, "ascii": 0, "$bit": 0, "$bitcount": 0,
        "$bitfind": 0, "$bitlogic": 0, "$case": 0, "$char": 0, "$classmethod": 0, "$classname": 0,
        "$compile": 0, "$data": 0, "$decimal": 0, "$double": 0, "$extract": 0, "$factor": 0,
        "$find": 0, "$fnumber": 0, "$get": 0, "$increment": 0, "$inumber": 0, "$isobject": 0,
        "$isvaliddouble": 0, "$isvalidnum": 0, "$justify": 0, "$length": 0, "$list": 0,
        "$listbuild": 0, "$listdata": 0, "$listfind": 0, "$listfromstring": 0, "$listget": 0,
        "$listlength": 0, "$listnext": 0, "$listsame": 0, "$listtostring": 0, "$listvalid": 0,
        "$locate": 0, "$match": 0, "$method": 0, "$name": 0, "$nconvert": 0, "$next": 0,
        "$normalize": 0, "$now": 0, "$number": 0, "$order": 0, "$parameter": 0, "$piece": 0,
        "$prefetchoff": 0, "$prefetchon": 0, "$property": 0, "$qlength": 0, "$qsubscript": 0,
        "$query": 0, "$random": 0, "$replace": 0, "$reverse": 0, "$sconvert": 0, "$select": 0,
        "$sortbegin": 0, "$sortend": 0, "$stack": 0, "$text": 0, "$translate": 0, "$view": 0,
        "$wascii": 0, "$wchar": 0, "$wextract": 0, "$wfind": 0, "$wiswide": 0, "$wlength": 0,
        "$wreverse": 0, "$xecute": 0, "$zabs": 0, "$zarccos": 0, "$zarcsin": 0, "$zarctan": 0,
        "$zcos": 0, "$zcot": 0, "$zcsc": 0, "$zdate": 0, "$zdateh": 0, "$zdatetime": 0,
        "$zdatetimeh": 0, "$zexp": 0, "$zhex": 0, "$zln": 0, "$zlog": 0, "$zpower": 0, "$zsec": 0,
        "$zsin": 0, "$zsqr": 0, "$ztan": 0, "$ztime": 0, "$ztimeh": 0, "$zboolean": 0,
        "$zconvert": 0, "$zcrc": 0, "$zcyc": 0, "$zdascii": 0, "$zdchar": 0, "$zf": 0,
        "$ziswide": 0, "$zlascii": 0, "$zlchar": 0, "$zname": 0, "$zposition": 0, "$zqascii": 0,
        "$zqchar": 0, "$zsearch": 0, "$zseek": 0, "$zstrip": 0, "$zwascii": 0, "$zwchar": 0,
        "$zwidth": 0, "$zwpack": 0, "$zwbpack": 0, "$zwunpack": 0, "$zwbunpack": 0, "$zzenkaku": 0,
        "$change": 0, "$mv": 0, "$mvat": 0, "$mvfmt": 0, "$mvfmts": 0, "$mviconv": 0,
        "$mviconvs": 0, "$mvinmat": 0, "$mvlover": 0, "$mvoconv": 0, "$mvoconvs": 0, "$mvraise": 0,
        "$mvtrans": 0, "$mvv": 0, "$mvname": 0, "$zbitand": 0, "$zbitcount": 0, "$zbitfind": 0,
        "$zbitget": 0, "$zbitlen": 0, "$zbitnot": 0, "$zbitor": 0, "$zbitset": 0, "$zbitstr": 0,
        "$zbitxor": 0, "$zincrement": 0, "$znext": 0, "$zorder": 0, "$zprevious": 0, "$zsort": 0,
        "device": 0, "$ecode": 0, "$estack": 0, "$etrap": 0, "$halt": 0, "$horolog": 0,
        "$io": 0, "$job": 0, "$key": 0, "$namespace": 0, "$principal": 0, "$quit": 0, "$roles": 0,
        "$storage": 0, "$system": 0, "$test": 0, "$this": 0, "$tlevel": 0, "$username": 0,
        "$x": 0, "$y": 0, "$za": 0, "$zb": 0, "$zchild": 0, "$zeof": 0, "$zeos": 0, "$zerror": 0,
        "$zhorolog": 0, "$zio": 0, "$zjob": 0, "$zmode": 0, "$znspace": 0, "$zparent": 0, "$zpi": 0,
        "$zpos": 0, "$zreference": 0, "$zstorage": 0, "$ztimestamp": 0, "$ztimezone": 0,
        "$ztrap": 0, "$zversion": 0, "##class": 0
    };

};
