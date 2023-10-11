const db = require("../models");
const Phones = db.phones;
const Op = db.Sequelize.Op;

// Create phone
exports.create = (req, res) => {
  const phone = {
    name: req.body.name,
    number: req.body.number,
    contactId: req.body.contactId,
  };

  Phones.create(phone)
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Get all phones
exports.findAll = (req, res) => {
  const contactId = req.params.contactId;
  Phones.findAll({ where: { contactId: contactId } })
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Get one phone by id
exports.findOne = (req, res) => {
  const id = req.params.phoneId;
  Phones.findByPk(id)
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Update one phone by id
exports.update = (req, res) => {
  const id = req.params.phoneId;
  Phones.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num === 1) res.send({ message: "Phone updated successfully." });
      else res.send({ message: `Cannot update Phone with id=${id}.` });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Delete one phone by id
exports.delete = (req, res) => {
  const id = req.params.phoneId;
  Phones.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num === 1) res.send({ message: "Phone was deleted successfully." });
      else res.send({ message: `Cannot delete Phone with id=${id}.` });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
