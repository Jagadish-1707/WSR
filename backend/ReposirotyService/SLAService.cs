using backend.Common;
using backend.DtoModels;
using backend.Models;
using backend.RepositoryInterface;
using Newtonsoft.Json;

namespace backend.ReposirotyService
{
    public class SLAService : ISLAService
    {
        private readonly IConfiguration _configuration;
        private readonly UnitOfWork _unitOfWork;
        private readonly string _apiService;

        public SLAService(IConfiguration configuration)
        {
            _configuration = configuration;
            _unitOfWork = new UnitOfWork(configuration);            
        }

        //SLA
        
        public List<SLA> GetAllSLA()
        {
            var contextData =  _unitOfWork.SLARepository.Context;
            return contextData.SLAs.Where(x => x.Active == true).OrderByDescending(sla => sla.SLAId).ToList();
        }
        public List<SLA> GetSLAMetricsList()
        {
            var contextData = _unitOfWork.SLARepository.Context;
            return contextData.SLAs.Where(x => x.Active == true && x.Status == 1).OrderByDescending(sla => sla.SLAId).ToList();
        }
        public async Task<SLADto> AddSLA(AddSLADto addSLA)
        {

            try
            {

                long SLAId = 0;

                SLA sla = new SLA();

                using (var transaction = _unitOfWork.SLARepository.Context.Database.BeginTransaction())
                {
                    sla.CustomerId = addSLA.CustomerId;
                    sla.CustomerName = addSLA.CustomerName;
                    sla.ProjectId = addSLA.ProjectId;
                    sla.ProjectName = addSLA.ProjectName;
                    sla.Priority = addSLA.Priority;
                    sla.SLAHours = addSLA.SLAHours;
                    sla.Status = addSLA.Status;
                    sla.Active = true;
                    sla.Remarks = addSLA.Remarks;
                    sla.CreatedOn = DateTime.Now;

                    _unitOfWork.SLARepository.Insert(sla);

                    _unitOfWork.Save();
                    transaction.Commit();

                    SLAId = sla.SLAId;
                }
                if (SLAId != 0)
                {

                    return await GetSLADetailsByIdAsync(SLAId);

                }
                else
                    return null;
            }
            catch (Exception e)
            {
                return null;
            }
        }
        public async Task<SLADto> EditSLADetailsAsync(SLADto editSLADetails)
        {
            try
            {
                var slaDetails = _unitOfWork.SLARepository.GetNoTrackWithInclude(x => x.SLAId == editSLADetails.SLAId).FirstOrDefault();
                if (slaDetails != null)
                {
                    using (var transaction = _unitOfWork.ProjectDetailsRepository.Context.Database.BeginTransaction())
                    {
                        slaDetails.SLAId = editSLADetails.SLAId;
                        slaDetails.CustomerId = editSLADetails.CustomerId;
                        slaDetails.CustomerName = editSLADetails.CustomerName;
                        slaDetails.ProjectName = editSLADetails.ProjectName;
                        slaDetails.Priority = editSLADetails.Priority;
                        slaDetails.SLAHours = editSLADetails.SLAHours;
                        slaDetails.Status = editSLADetails.Status;
                        slaDetails.Remarks = editSLADetails.Remarks;
                        slaDetails.Active = editSLADetails.Active;
                        _unitOfWork.SLARepository.Update(slaDetails);
                        _unitOfWork.Save();
                        transaction.Commit();
                    }
                    return await GetSLADetailsByIdAsync(editSLADetails.SLAId);
                }
                return null;
            }
            catch (Exception e)
            {
                return null;
            }
        }
        public async Task<SLADto> GetSLADetailsByIdAsync(long id)
        {
            try
            {
                var contextData = _unitOfWork.SLARepository.Context;
                var slaDetailsDto = contextData.SLAs.Where(w => w.SLAId.Equals(id)).Select(s => new SLADto

                {
                    SLAId = s.SLAId,
                    CustomerId = s.CustomerId,
                    CustomerName = s.CustomerName,
                    ProjectId = s.ProjectId,
                    ProjectName = s.ProjectName,
                    Priority = s.Priority,
                    SLAHours = s.SLAHours,
                    Status = s.Status,
                    Remarks = s.Remarks,
                    Active = s.Active,
                    // Add other properties as needed
                }).FirstOrDefault();

                if (slaDetailsDto == null)
                {
                    return null;
                }
                else
                {
                    return slaDetailsDto;
                }
            }
            catch (Exception ex)
            {
                ex.ToString();
                return null;
            }
        }

        //Response SLA

        public List<ResponseSLA> GetAllResponseSLA()
        {
            var contextData = _unitOfWork.ResponseSLARepository.Context;
            return contextData.ResponseSLA.Where(x => x.Active == true).OrderByDescending(sla => sla.Id).ToList();
        }
        public List<ResponseSLA> GetSLAResponseMetricsList()
        {
            var contextData = _unitOfWork.ResponseSLARepository.Context;
            return contextData.ResponseSLA.Where(x => x.Active == true && x.Status == 1).OrderByDescending(sla => sla.Id).ToList();
        }
        public async Task<ResponseSLADto> AddResponseSLA(AddResponseSLADto addSLA)
        {

            try
            {
                long SLAId = 0;
                ResponseSLA sla = new ResponseSLA();
                using (var transaction = _unitOfWork.ResponseSLARepository.Context.Database.BeginTransaction())
                {
                    sla.CustomerId = addSLA.CustomerId;
                    sla.CustomerName = addSLA.CustomerName;
                    sla.ProjectId = addSLA.ProjectId;
                    sla.ProjectName = addSLA.ProjectName;
                    sla.PriorityId = addSLA.PriorityId;
                    sla.SLAHours = addSLA.SLAHours;
                    sla.Status = addSLA.Status;
                    sla.Active = true;
                    sla.Remarks = addSLA.Remarks;
                    sla.CreatedOn = DateTime.Now;

                    _unitOfWork.ResponseSLARepository.Insert(sla);
                    _unitOfWork.Save();
                    transaction.Commit();

                    SLAId = sla.Id;
                }
                if (SLAId != 0)
                {
                    return await GetResponseSLADetailsByIdAsync(SLAId);
                }
                else
                    return null;
            }
            catch (Exception e)
            {
                return null;
            }
        }
        public async Task<ResponseSLADto> EditResponseSLA(EditResponseSLADto editSLADetails)
        {
            try
            {
                var slaDetails = _unitOfWork.ResponseSLARepository.GetNoTrackWithInclude(x => x.Id == editSLADetails.Id).FirstOrDefault();
                if (slaDetails != null)
                {
                    using (var transaction = _unitOfWork.ResponseSLARepository.Context.Database.BeginTransaction())
                    {
                        slaDetails.Id = editSLADetails.Id;
                        slaDetails.CustomerId = editSLADetails.CustomerId;
                        slaDetails.CustomerName = editSLADetails.CustomerName;
                        slaDetails.ProjectName = editSLADetails.ProjectName;
                        slaDetails.PriorityId = editSLADetails.PriorityId;
                        slaDetails.SLAHours = editSLADetails.SLAHours;
                        slaDetails.Status = editSLADetails.Status;
                        slaDetails.Remarks = editSLADetails.Remarks;
                        slaDetails.Active = editSLADetails.Active;
                        _unitOfWork.ResponseSLARepository.Update(slaDetails);
                        _unitOfWork.Save();
                        transaction.Commit();
                    }
                    return await GetResponseSLADetailsByIdAsync(editSLADetails.Id);
                }
                return null;
            }
            catch (Exception e)
            {
                return null;
            }
        }
        public async Task<ResponseSLADto> GetResponseSLADetailsByIdAsync(long id)
        {
            try
            {
                var contextData = _unitOfWork.ResponseSLARepository.Context;
                var slaDetailsDto = contextData.ResponseSLA.Where(w => w.Id.Equals(id)).Select(s => new ResponseSLADto

                {
                    Id = s.Id,
                    CustomerId = s.CustomerId,
                    CustomerName = s.CustomerName,
                    ProjectId = s.ProjectId,
                    ProjectName = s.ProjectName,
                    PriorityId = s.PriorityId,
                    SLAHours = s.SLAHours,
                    Status = s.Status,
                    Remarks = s.Remarks,
                    Active = s.Active,
                }).FirstOrDefault();

                if (slaDetailsDto == null)
                {
                    return null;
                }
                else
                {
                    return slaDetailsDto;
                }
            }
            catch (Exception ex)
            {
                ex.ToString();
                return null;
            }
        }

    }
}
        
