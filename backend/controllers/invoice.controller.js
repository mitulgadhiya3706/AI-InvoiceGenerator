const Invoice = require("../models/invoice");

const createInvoice = async (req, res) => {
    try{
        const user = req.user;

        const {
            invoiceNumber,
            invoiceDate, 
            dueDate,
            billTo,
            billFrom,
            items,
            notes, 
            paymentTerms,
        } = req.body;

        let subTotal = 0;
        let taxTotal = 0;
        items.forEach((item) => {
            const itemTotal = item.unitPrice * item.quantity;
            subTotal += itemTotal;
            taxTotal += itemTotal * ((item.taxPercentage || 0) / 100);
        })

        const total = subTotal + taxTotal;

        const invoice = new Invoice({
            user, 
            invoiceNumber,
            invoiceDate,
            dueDate,
            billTo,
            billFrom,
            items,
            notes,
            paymentTerms,
            subTotal,
            taxTotal,
            total,
        });

        await invoice.save();
        res.status(201).json(invoice);

    } catch(err){
        console.error("Error creating invoice", err);
        res.status(500).json({ message: "Server error" });
    }
}

const getInvoice = async (req, res) => {
    try{
        const invoices = await Invoice.find({ user: req.user._id }).populate("user", "name email");
        res.json(invoices);
    } catch(err){
        console.error("Error getting invoice", err);
        res.status(500).json({ message: "Server error" });
    }
}

const getInvoiceById = async (req, res) => {
    try{
        const invoice = await Invoice.findById(req.params.id).populate("user", "name email");
        
        if(invoice){
            res.json(invoice);
        } else{
            res.status(404).json({ message: "Invoice not found!"})
        }

    } catch(err){
        console.error("Error getting invoice", err);
        res.status(500).json({ message: "Server error" });
    }
}


const updateInvoice = async (req, res) => {
    try{
        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billTo,
            billFrom,
            items,
            notes,
            paymentTerms,
            status
        } = req.body;
        
        const updateData = { status };

        if(items && items.length > 0){
            let subTotal = 0;
            let taxTotal = 0;
            items.forEach((item) => {
                const itemTotal = item.unitPrice * item.quantity;
                subTotal += itemTotal;
                taxTotal += itemTotal * ((item.taxPercentage || 0) / 100);
            });

            const total = subTotal + taxTotal;

            //merge all the updated fields into updateData
            //A way to copy properties from one object into another without manually writing
            Object.assign(updateData, {
                invoiceNumber, invoiceDate, dueDate, billTo, billFrom,
                items, notes, paymentTerms, subtotal, taxTotal, total
            });

            const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, updateData, { new: true });

            if(!updatedInvoice){
                return res.status(404).json({ message: "Invoice not found" });
            }
            res.json(updatedInvoice);
        }

    } catch(err){
        console.error("Error updating invoice", err);
        res.status(500).json({ message: "Server error" });
    }
}

const deleteInvoice = async (req, res) => {
    try{
        const invoice = await Invoice.findByIdAndDelete(req.params.id);

        if(!invoice){
            res.status(404).json({message: "Invoice not found!"});
        }
        res.json({message: "Invoice deleted successfully"});

    } catch(err){
        console.error("Error deleting invoice", err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.module = {createInvoice, getInvoice, getInvoiceById, updateInvoice, deleteInvoice};