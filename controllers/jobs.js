const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  if (!jobs) {
    throw new NotFoundError("Invalid User");
  }
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const job = await Job.findOne({
    createdBy: req.user.userId,
    _id: req.params.id,
  });
  if (!job) {
    throw new NotFoundError(`No Job with that ID ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;
  if (company === "" || position === "" || !company || !position) {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }
  const job = await Job.findOneAndUpdate(
    { createdBy: userId, _id: jobId },
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  if (!job) {
    throw new NotFoundError(`No Job with that ID ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
  const job = await Job.findOneAndDelete(
    { createdBy: req.user.userId, _id: req.params.id },
    { useFindAndModify: false }
  );
  if (!job) {
    throw new NotFoundError(`No Job with that ID ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({ status: "Successful Deletion", job: null });
};

module.exports = {
  getAllJobs,
  getJob,
  deleteJob,
  createJob,
  updateJob,
};
