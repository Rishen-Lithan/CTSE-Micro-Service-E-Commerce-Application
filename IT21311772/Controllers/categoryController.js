import Category from "../Models/categoryModel.js";

export const getAllCategories = async (req, res) => {
    const categories = await Category.find();
    if(!categories) return res.status(404).json({ 'message': 'No Categories Found '});
    return res.status(200).json(categories);
}

export const createCategory = async (req, res) => {
    if (!req?.body?.category) {
        return res.status(400).json({ 'message': 'Please Enter the Category '});
    }

    try {
        const category = await Category.create({
            category: req.body.category,
            categoryStatus: 1
        });

        res.status(200).json(category)
    } catch (error) {
        console.error('Error creating product category : ', error);
        res.status(500).json({ 'message': error });
    }
}

export const changeCategoryStatus = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID is required '});
    }

    try {
        const category = await Category.findById({ _id: req.body.id });
        if (!category) {
            return res.status(404).json({'message': `No Categories found with ${req.body.id}`});
        }

        const categoryStatus = category.categoryStatus;

        if (categoryStatus === 1) {
            category.categoryStatus = 0;
        } else {
            category.categoryStatus = 1;
        }

        const updatedCategory = await category.save();
        res.status(201).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category status : ', error);
        res.status(500).json({ 'message': error });
    }
}

export const deleteCategory = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID is required' });
    }

    try {
        const category = await Category.findById({_id: req.body.id });
        if (!category) {
            return res.status(404).json({ 'message': 'Category Not Found ' });
        }

        const result = await category.deleteOne({ _id: req.body.id });
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting category : ', error);
        res.status(500).json({ 'message': error });
    }
}