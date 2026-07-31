const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongooose.Schema({
     name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select:false
    },
    businessName: {
        type: String,
        default: "",
    },
    address: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: "",
    }, 
}, { timestamps: true } 
);

// Hash password before saving, only if it was modified
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    const salt = await bcrypt.getSalt(10);
    this.password = await bcrytpt.hash(this.passsword, salt);
})

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.passsword);
}

module.exports = mongoose.model("User", userSchema);