var mongoose = require('mongoose');
var schema = mongoose.Schema;

var titleSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    CIN:{
        type: String,
        required:false
    },
    companyName:{
        type: String,
        required:true
    },
    NIC_Code:{

        type: String,
        required:false
    },
    CMIE_ProwessCode:{

        type: String,
        required:false
    },
    NIC_industry:{

        type: String,
        required:false
    },
    ISIN_Code:{

        type: String,
        required:false
    },
    GovernanceAnalystName:{

        type: String,
        required:false
    },
    GovernanceQAName:{

        type: String,
        required:false
    },
    EnvironmentAnalystName:{

        type: String,
        required:false
    },
    EnvironmentQAName :{

        type: String,
        required:false
    },
    SocialAnalystName:{

        type: String,
        required:false
    },
    SocialQAName:{

        type: String,
        required:false
    }
    
});

module.exports = mongoose.model('CompanyTitle', titleSchema);